'use client';
import { secondaryBtnStyles } from '@/app/commonStyles';
import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useProjectAccess } from '@/hooks/useProjectAccess';
import { useProjectQueries } from '@/hooks/useProjectQueries';
import { cn } from '@/lib/utils';
// Local type definitions because '@/types' module is missing
type IStatus = {
  id: string;
  name: string;
  color?: string;
  label: string;
  limit: number;
  // extend with other properties as needed
};

type ITaskWithOptions = {
  id: string;
  title: string;
  statusId: string;
  description?: string;
  labels?: string[];
  size?: number;
  priority?: number;
  // extend with other properties as needed
};

import { columns as columnsUtils } from '@/utils/columns';
import { getColumnSortedTasks, sortTasks } from '@/utils/sort';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { Eye, Plus } from 'lucide-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { ColumnContainer } from './ColumnContainer';
import { TaskDetailsProvider } from './TaskDetailsContext';
import { TaskDetailsDrawer } from './TaskDetailsDrawer';
import { TaskItem } from './TaskItem';
import { useBoardDragAndDrop } from './useBoardDragAndDrop';
import { createPortal } from 'react-dom';
import { ICustomFieldData } from '@/consts/default-options';

interface Props {
  projectId: string;
  projectName: string;
  statuses: IStatus[];
}

interface Props {
  item: any;
  projectName: string;
  index: number;
}

interface CreateCustomFieldOptionModalProps {
  title: string;
  triggerLabel?: string;
  triggerBtn?: ReactElement<{ onClick?: (...args: any[]) => void }>;
  // allow async handlers and accept a broader parameter shape to avoid cross-module structural mismatches
  handleSubmit?: (data: any) => void | Promise<void>;
  action?: 'create-new-project' | 'update-project';
}

export const Board: React.FC<Props> = ({
  projectId,
  projectName,
  statuses,
}) => {
  const { can } = useProjectAccess({ projectId });
  const [columns, setColumns] = useState(statuses);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { projectTasks, reloadProjectTasks } = useProjectQueries(projectId);
  const [tasks, setTasks] = useState<ITaskWithOptions[]>(projectTasks || []);

  const {
    activeTask,
    sensors,
    overColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  } = useBoardDragAndDrop();

  useEffect(() => {
    setTasks(projectTasks || []);
  }, [projectTasks]);

  const sortedTasks = sortTasks(tasks as any);

  const getColumnTasks = (statusId: string) => {
    return getColumnSortedTasks(sortedTasks, statusId);
  };

  const handleTaskCreated = (task: any) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleColumnUpdate = (updatedColumn: IStatus) => {
    setColumns((prev) =>
      prev.map((status) =>
        status.id === updatedColumn.id ? updatedColumn : status
      )
    );
  };

  const handleColumnDelete = (columnId: string) => {
    setColumns((prev) => prev.filter((status) => status.id !== columnId));
  };

  const handleColumnHide = (columnId: string) => {
    setHiddenColumns((prev) => new Set([...prev, columnId]));
  };

  const handleShowHiddenColumns = () => {
    setHiddenColumns(new Set());
  };

  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.has(column.id)
  );

  const handleCreateColumn = async (data: Omit<ICustomFieldData, 'id'>) => {
    try {
      setIsLoading(true);
      const newColumn = await columnsUtils.createColumn(projectId, data);
      setColumns((prev) => [...prev, newColumn]);
      toast({
        title: 'Success',
        description: 'Column created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating column:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create column',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<any>) => {
    (async () => {
      try {
        if ('labels' in updates || 'size' in updates || 'priority' in updates) {
          await reloadProjectTasks();
        } else {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId
                ? { ...task, ...(updates as Partial<ITaskWithOptions>) }
                : task
            )
          );
        }
      } catch (error) {
        console.error('Error updating task:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update task',
        });
      }
    })();
  };

  return (
    <TaskDetailsProvider onTaskUpdate={handleTaskUpdate}>
      <div className="h-[calc(100vh-200px)]">
        {hiddenColumns.size > 0 && (
          <div className="py-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1.5"
              onClick={handleShowHiddenColumns}
            >
              <Eye className="w-3 h-3" />
              Show hidden columns ({hiddenColumns.size})
            </Button>
          </div>
        )}

        <div className="flex gap-1 w-full overflow-x-auto py-1">
          <div
            className={cn(
              'flex gap-3',
              hiddenColumns.size > 0
                ? 'h-[calc(100vh-175px)]'
                : 'h-[calc(100vh-155px)]'
            )}
          >
              <DndContext
              onDragEnd={(event) => handleDragEnd(event, sortedTasks as any, setTasks as any)}
              onDragStart={handleDragStart}
              onDragOver={(event) => handleDragOver(event)}
              collisionDetection={closestCorners}
              sensors={sensors}
            >
              {visibleColumns.map((column) => (
                <ColumnContainer
                  projectId={projectId}
                  key={column.id}
                  column={column}
                  can={can}
                  tasks={getColumnTasks(column.id) as any}
                  projectName={projectName}
                  onTaskCreated={handleTaskCreated}
                  onColumnUpdate={(col: any) => handleColumnUpdate(col)}
                  onColumnDelete={handleColumnDelete}
                  onColumnHide={handleColumnHide}
                  isOver={overColumnId === column.id}
                />
              ))}

              {typeof document !== 'undefined' &&
              createPortal(
                <DragOverlay>
                  {activeTask && (
                    <TaskItem 
                      projectName={projectName}
                      index={0} 
                      item={activeTask as any}                      />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>

          <CreateCustomFieldOptionModal
            title="New Column"
            triggerBtn={
              <Button
                className={cn(secondaryBtnStyles, 'w-8 h-8 p-2 mr-4')}
                disabled={isLoading}
              >
                <Plus />
              </Button>
            }
          />

          <TaskDetailsDrawer />
        </div>
      </div>
    </TaskDetailsProvider>
  );
};
