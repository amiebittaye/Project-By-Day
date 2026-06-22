'use client';
import { CustomFieldTagRenderer } from '@/components/CustomFieldTagRenderer';
import { LabelBadge } from '@/components/LabelBadge';
import StackedAvatars from '@/components/StackedAvaters';
import { prefetchTask } from '@/hooks/useTaskQueries';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskDetails } from './TaskDetailsContext';
import { Key } from 'react';
import { IUser } from '@/utils/users';
import { ITaskWithOptions } from '../[taskId]/TaskDetailsWrapper';

interface Props {
  item: ITaskWithOptions;
  projectName: string;
  index: number;
}

export const TaskItem = ({ item, projectName, index }: Props) => {
  const queryClient = useQueryClient();
  const { openDrawer } = useTaskDetails();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id as UniqueIdentifier,
    data: {
      type: 'task',
      task: item,
      position: index,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleClick = async () => {
    // Prefetch task data before opening drawer
    await prefetchTask(queryClient, item.id!);
    openDrawer(item, projectName);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[95%] min-h-20 bg-gray-200 dark:bg-gray-800 rounded-md border border-dashed border-gray-400 dark:border-gray-600"
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white dark:bg-gray-900 px-4 py-3 mx-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm cursor-grab"
      >
        <div className="flex justify-between">
          <span className="text-[11px] text-gray-400 dark:text-gray-400">
            {projectName}
          </span>
          <StackedAvatars users={(item.assignees as Partial<IUser>[]) || []} />
        </div>
        <div
          onClick={handleClick}
          className="my-2 cursor-pointer hover:underline w-fit"
        >
          <p>{item.title}</p>
        </div>
        <div className="space-x-2">
          {item.priority && (
            <CustomFieldTagRenderer
              color={typeof item.priority === 'object' ? (item.priority as any).color : undefined}
              label={typeof item.priority === 'object' ? (item.priority as any).label : (item.priority as string)}
            />
          )}
          {item.size && (
            <CustomFieldTagRenderer
              color={typeof item.size === 'object' ? (item.size as any).color : undefined}
              label={typeof item.size === 'object' ? (item.size as any).label : (item.size as unknown as string)}
            />
          )}
          {(item.labels as { id?: Key | null; color?: string; label?: string }[] | undefined)?.map((label) => (
            <LabelBadge
              key={label.id}
              color={label.color ?? 'gray'}
              labelText={label.label ?? ''}
            />
          ))}
        </div>
      </div>
    </>
  );
};
