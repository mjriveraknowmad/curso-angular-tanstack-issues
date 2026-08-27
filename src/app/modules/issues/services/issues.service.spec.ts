import { TestBed } from '@angular/core/testing';
import { IssuesService } from './issues.service';
import {
  provideAngularQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { State, Type, AuthorAssociation, GitHubLabel, GitHubIssue, Reactions } from '../interfaces';

describe('IssuesService', () => {
  let service: IssuesService;
  const queryClient = new QueryClient();
  let fetchSpy: jasmine.Spy;

  const createMockUser = () => ({
    login: 'user',
    id: 1,
    node_id: 'MDQ6VXNlcjE=',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/user',
    html_url: 'https://github.com/user',
    followers_url: 'https://api.github.com/users/user/followers',
    following_url: 'https://api.github.com/users/user/following{/other_user}',
    gists_url: 'https://api.github.com/users/user/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/user/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/user/subscriptions',
    organizations_url: 'https://api.github.com/users/user/orgs',
    repos_url: 'https://api.github.com/users/user/repos',
    events_url: 'https://api.github.com/users/user/events{/privacy}',
    received_events_url: 'https://api.github.com/users/user/received_events',
    type: Type.User,
    site_admin: false,
  });

  const createMockIssue = (overrides?: Partial<GitHubIssue>): GitHubIssue => ({
    id: 1,
    node_id: 'node_1',
    url: 'https://api.github.com/repos/angular/angular/issues/1',
    repository_url: 'https://api.github.com/repos/angular/angular',
    labels_url: 'https://api.github.com/repos/angular/angular/issues/1/labels{/name}',
    comments_url: 'https://api.github.com/repos/angular/angular/issues/1/comments',
    events_url: 'https://api.github.com/repos/angular/angular/issues/1/events',
    html_url: 'https://github.com/angular/angular/issues/1',
    number: 1,
    title: 'Issue 1',
    user: createMockUser(),
    labels: [],
    state: State.Open,
    locked: false,
    assignee: null,
    assignees: [],
    milestone: {
      url: 'https://api.github.com/repos/angular/angular/milestones/1',
      html_url: 'https://github.com/angular/angular/milestones/1',
      labels_url: 'https://api.github.com/repos/angular/angular/milestones/1/labels',
      id: 1,
      node_id: 'MDk6TWlsZXN0b25lMzA0NTk2Nw==' as any,
      number: 1,
      title: 'Backlog' as any,
      description: 'Test milestone',
      creator: createMockUser(),
      open_issues: 5,
      closed_issues: 2,
      state: State.Open,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
      due_on: null,
      closed_at: null,
    },
    comments: 0,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    closed_at: null,
    author_association: AuthorAssociation.None,
    active_lock_reason: null,
    body: 'Test issue',
    reactions: {
      url: 'https://api.github.com/repos/angular/angular/issues/1/reactions',
      total_count: 0,
      '+1': 0,
      '-1': 0,
      laugh: 0,
      hooray: 0,
      confused: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
    timeline_url: 'https://api.github.com/repos/angular/angular/issues/1/timeline',
    performed_via_github_app: null,
    state_reason: null,
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      teardown: {
        destroyAfterEach: false,
      },
      providers: [provideAngularQuery(queryClient)],
    });

    service = TestBed.inject(IssuesService);
    fetchSpy = spyOn(window, 'fetch');
  });

  afterEach(() => {
    fetchSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load labels', async () => {
    const mockLabels: GitHubLabel[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      node_id: `node_${i}`,
      url: `https://api.github.com/repos/angular/angular/labels/label${i}`,
      name: `label-${i}`,
      color: 'FFFFFF',
      default: false,
      description: `Description ${i}`,
    }));

    fetchSpy.and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(mockLabels), { status: 200 })
      )
    );

    const { data } = await service.labelsQuery.refetch();

    expect(data?.length).toBe(30);

    const [label] = data!;

    expect(typeof label.color).toBe('string');
    expect(typeof label.default).toBe('boolean');
    expect(typeof label.description).toBe('string');
    expect(typeof label.id).toBe('number');
    expect(typeof label.name).toBe('string');
    expect(typeof label.node_id).toBe('string');
    expect(typeof label.url).toBe('string');
  });

  it('should set selected state, OPEN, CLOSED, ALL', async () => {
    const mockIssues = Array.from({ length: 5 }, (_, i) =>
      createMockIssue({
        id: i,
        number: i + 1,
        title: `Issue ${i}`,
        state: State.Closed,
      })
    );

    service.showIssuesByState(State.Closed);
    expect(service.selectedState()).toBe(State.Closed);

    fetchSpy.and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(mockIssues), { status: 200 })
      )
    );

    const { data } = await service.issuesQuery.refetch();

    data?.forEach((issue) => {
      expect(issue.state).toBe(State.Closed);
    });

    service.showIssuesByState(State.Open);

    const openIssues = mockIssues.map((issue, i) => createMockIssue({
      ...issue,
      id: i,
      number: i + 1,
      title: `Issue ${i}`,
      state: State.Open,
    }));
    fetchSpy.and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(openIssues), { status: 200 })
      )
    );

    const { data: dataOpen } = await service.issuesQuery.refetch();

    dataOpen?.forEach((issue) => {
      expect(issue.state).toBe(State.Open);
    });
  });

  it('should set selectedLabels', async () => {
    service.toggleLabel('Accessibility');
    expect(service.selectedLabels().has('Accessibility')).toBeTrue();

    service.toggleLabel('Accessibility');
    expect(service.selectedLabels().has('Accessibility')).toBeFalse();
  });

  it('should set selectedLabels and get issues by label', async () => {
    const label = 'Accessibility';

    const mockIssuesWithLabel = [
      createMockIssue({
        labels: [
          {
            id: 1,
            node_id: 'MDU6TGFiZWwx',
            url: 'https://api.github.com/repos/angular/angular/labels/Accessibility',
            name: 'Accessibility',
            color: 'FFFFFF',
            default: false,
            description: 'Accessibility issues',
          },
        ],
      }),
    ];

    service.toggleLabel(label);
    expect(service.selectedLabels().has(label)).toBeTrue();

    fetchSpy.and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(mockIssuesWithLabel), { status: 200 })
      )
    );

    const { data } = await service.issuesQuery.refetch();

    data?.forEach((issue) => {
      const hasLabel = issue.labels.some((l) => l.name === label);
      expect(hasLabel).toBeTrue();
    });
  });
});
