'use client';
import { toast } from '@/components/ui/use-toast';
import { useProjectQueries } from '@/hooks/useProjectQueries';
import { useParams } from 'next/navigation';
import { TaskDetailsProvider } from '../Board/TaskDetailsContext';
import { SingleTaskDetails } from './TaskDetails';
// Local type definition (fallback for missing '@/types')
export type Label = {
  id: string;
  name: string;
  color?: string;
};

type Priority = 'low' | 'medium' | 'high' | string;

export interface ITaskWithOptions {
  id: string;
  title?: string;
  description?: string;
  labels?: Label[];
  size?: number | null;
  priority?: Priority;
  [key: string]: any;
}

export const TaskDetailsWrapper = ({ task }: { task: ITaskWithOptions }) => {
  const { projectId } = useParams();
  const { reloadProjectTasks } = useProjectQueries(projectId as string);

  const handleTaskUpdate = async (
    _taskId: string,
    updates: Partial<ITaskWithOptions>
  ) => {
    try {
      if ('labels' in updates || 'size' in updates || 'priority' in updates) {
        await reloadProjectTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task',
      });
    }
  };

  return (
    <TaskDetailsProvider onTaskUpdate={handleTaskUpdate}>
      <SingleTaskDetails task={task} />
    </TaskDetailsProvider>
  );
};
