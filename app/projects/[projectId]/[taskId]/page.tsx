import { tasks } from '@/utils/tasks';
import { TaskDetailsWrapper } from './TaskDetailsWrapper';

interface Props {
  params: Promise<{
    taskId: string;
  }>;
}
const TaskDetailsPage = async ({ params }: Props) => {
  const { taskId } = await params;

  const task = await tasks.details.get(taskId);

  const safeTask = {
    ...task,
    title: task.title ?? undefined,
    labels: (task.labels ?? []).map((l) => ({
      ...l,
      name: (l as any).name ?? (l as any).title ?? '',
    })),
  };

  return <TaskDetailsWrapper task={safeTask as any} />;
};

export default TaskDetailsPage;
