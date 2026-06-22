interface ITask {
  id: string;
  title?: string;
  status_id?: string | null;
  label_ids?: string[] | null;
  size_id?: string | null;
  priority_id?: string | null;
  [key: string]: unknown;
}

interface IStatus {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: unknown;
}

interface ILabel {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: unknown;
}

interface ISize {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: unknown;
}

interface IPriority {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: unknown;
}
