interface ITasksByPriority {
  name: string;
  count: number;
}

// Minimal local type definitions to satisfy references.
// Extend these as needed to match your application's models.
interface ITask {
  id: string;
  title?: string;
  // priority can be undefined or null in some tasks, so keep it optional
  priority?: string | null;
}

interface IPriority {
  id: string;
  label: string;
}

export function getTasksByPriority(
  tasks: ITask[],
  priorities: IPriority[]
): ITasksByPriority[] {
  const priorityMap = new Map<string, number>();

  priorities.forEach((priority) => priorityMap.set(priority.id, 0));

  tasks.forEach((task) => {
    if (priorityMap.has(task.priority as string)) {
      priorityMap.set(
        task.priority as string,
        (priorityMap.get(task.priority as string) || 0) + 1
      );
    }
  });

  return priorities.map((priority) => ({
    name: priority.label,
    count: priorityMap.get(priority.id) || 0,
  }));
}
