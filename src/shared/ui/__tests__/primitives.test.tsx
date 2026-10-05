import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Pagination,
  Progress,
  Select,
  Separator,
  Skeleton,
  Table,
  Tabs,
  Textarea,
} from '../index';

describe('Shared Kernel UI Primitives Rendering', () => {
  it('renders Button with variants and loading state', () => {
    const htmlPrimary = renderToStaticMarkup(
      <Button variant="primary" size="md">
        Save Changes
      </Button>,
    );
    expect(htmlPrimary).toContain('Save Changes');
    expect(htmlPrimary).toContain('bg-brand-500');

    const htmlDanger = renderToStaticMarkup(
      <Button variant="danger" size="sm">
        Delete Post
      </Button>,
    );
    expect(htmlDanger).toContain('Delete Post');
    expect(htmlDanger).toContain('bg-red-600');

    const htmlLoading = renderToStaticMarkup(
      <Button isLoading>Submitting</Button>,
    );
    expect(htmlLoading).toContain('Submitting');
    expect(htmlLoading).toContain('animate-spin');
  });

  it('renders Badge with variants and dot indicator', () => {
    const html = renderToStaticMarkup(
      <Badge variant="success" dot>
        Published
      </Badge>,
    );
    expect(html).toContain('Published');
    expect(html).toContain('bg-emerald-50');
    expect(html).toContain('bg-emerald-500'); // dot
  });

  it('renders Table with columns and data rows', () => {
    interface Article {
      id: string;
      title: string;
      views: number;
    }

    const data: Article[] = [
      { id: '1', title: 'Microservices with NestJS', views: 1500 },
      { id: '2', title: 'Frontend Architecture 2026', views: 3200 },
    ];

    const columns = [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: (info: any) => info.getValue(),
      },
    ];

    const html = renderToStaticMarkup(<Table data={data} columns={columns} />);
    expect(html).toContain('Title');
    expect(html).toContain('Views');
    expect(html).toContain('Microservices with NestJS');
    expect(html).toContain('Frontend Architecture 2026');
  });

  it('renders Table with custom empty message when data is empty', () => {
    const html = renderToStaticMarkup(
      <Table data={[]} columns={[{ accessorKey: 'id', header: 'ID' }]} emptyMessage="No posts found" />,
    );
    expect(html).toContain('No posts found');
  });

  it('renders Pagination correctly with page numbers and results range', () => {
    const html = renderToStaticMarkup(
      <Pagination
        page={2}
        limit={10}
        total={45}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );
    expect(html).toContain('Showing');
    expect(html).toContain('11');
    expect(html).toContain('20');
    expect(html).toContain('45');
    expect(html).toContain('results');
  });

  it('renders Tabs in pills and underline variants', () => {
    const tabs = [
      { id: 'grid', label: 'Grid View', count: 12 },
      { id: 'table', label: 'Table View', count: 3 },
    ];

    const htmlPills = renderToStaticMarkup(
      <Tabs tabs={tabs} activeTab="grid" variant="pills" />,
    );
    expect(htmlPills).toContain('Grid View');
    expect(htmlPills).toContain('Table View');
    expect(htmlPills).toContain('12');

    const htmlUnderline = renderToStaticMarkup(
      <Tabs tabs={tabs} activeTab="table" variant="underline" />,
    );
    expect(htmlUnderline).toContain('Table View');
  });

  it('renders Card and Card subcomponents', () => {
    const html = renderToStaticMarkup(
      <Card hoverable>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>CPU usage is normal.</p>
        </CardContent>
      </Card>,
    );
    expect(html).toContain('System Metrics');
    expect(html).toContain('CPU usage is normal.');
  });

  it('renders Drawer when isOpen is true', () => {
    const html = renderToStaticMarkup(
      <Drawer isOpen={true} onClose={() => {}} title="New Blog Post">
        <p>Drawer Form Content</p>
      </Drawer>,
    );
    expect(html).toContain('New Blog Post');
    expect(html).toContain('Drawer Form Content');
  });

  it('renders Modal when isOpen is true', () => {
    const html = renderToStaticMarkup(
      <Modal isOpen={true} onClose={() => {}} title="Confirm Deletion">
        <p>Are you sure you want to delete this item?</p>
      </Modal>,
    );
    expect(html).toContain('Confirm Deletion');
    expect(html).toContain('Are you sure you want to delete this item?');
  });

  it('renders form elements: Input, Textarea, Select, Checkbox', () => {
    const htmlInput = renderToStaticMarkup(
      <Input label="Email Address" required error="Invalid email" />,
    );
    expect(htmlInput).toContain('Email Address');
    expect(htmlInput).toContain('Invalid email');

    const htmlTextarea = renderToStaticMarkup(
      <Textarea label="Message" helperText="Maximum 500 characters" />,
    );
    expect(htmlTextarea).toContain('Message');
    expect(htmlTextarea).toContain('Maximum 500 characters');

    const htmlSelect = renderToStaticMarkup(
      <Select
        label="Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
        ]}
      />,
    );
    expect(htmlSelect).toContain('Admin');
    expect(htmlSelect).toContain('Editor');

    const htmlCheckbox = renderToStaticMarkup(
      <Checkbox label="Agree to terms" description="Read terms carefully" />,
    );
    expect(htmlCheckbox).toContain('Agree to terms');
    expect(htmlCheckbox).toContain('Read terms carefully');
  });

  it('renders Avatar with initials fallback and status indicator', () => {
    const html = renderToStaticMarkup(
      <Avatar name="Alex Morgan" size="lg" status="online" />,
    );
    expect(html).toContain('AM');
    expect(html).toContain('bg-emerald-500');
  });

  it('renders Accordion, Breadcrumb, Progress, Separator, Skeleton, Dropdown', () => {
    const htmlAccordion = renderToStaticMarkup(
      <Accordion
        items={[{ id: '1', title: 'What is Kanzen?', content: 'Engineering excellence.' }]}
        defaultOpenIds={['1']}
      />,
    );
    expect(htmlAccordion).toContain('What is Kanzen?');
    expect(htmlAccordion).toContain('Engineering excellence.');

    const htmlBreadcrumb = renderToStaticMarkup(
      <Breadcrumb
        items={[
          { label: 'Blog', href: '/blog' },
          { label: 'Post Detail' },
        ]}
      />,
    );
    expect(htmlBreadcrumb).toContain('Blog');
    expect(htmlBreadcrumb).toContain('Post Detail');

    const htmlProgress = renderToStaticMarkup(<Progress value={75} showLabel />);
    expect(htmlProgress).toContain('75%');

    const htmlSeparator = renderToStaticMarkup(<Separator label="OR" />);
    expect(htmlSeparator).toContain('OR');

    const htmlSkeleton = renderToStaticMarkup(<Skeleton count={3} />);
    expect(htmlSkeleton).toContain('animate-pulse');

    const htmlDropdown = renderToStaticMarkup(
      <Dropdown trigger={<button>Actions</button>} items={[{ label: 'Edit' }]} />,
    );
    expect(htmlDropdown).toContain('Actions');
  });
});
