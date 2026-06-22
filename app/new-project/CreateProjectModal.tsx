'use client';

import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { CreateOrEditLabelForm } from '@/components/CreateOrEditLabelForm';
import { CustomFieldOptions } from '@/components/CustomFieldOptions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  defaultLabels,
  defaultPriorities,
  defaultSizes,
  defaultStatuses,
  ICustomFieldData,
} from '@/consts/default-options';
import { useModalDialog } from '@/hooks/useModalDialog';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { v4 as uid } from 'uuid';
import { secondaryBtnStyles, successBtnStyles } from '../commonStyles';
import { LabelList } from '../projects/[projectId]/settings/labels/LabelList';
import { useRouter } from 'next/navigation';
import { projects } from '@/utils/projects';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

type CustomFieldDBTableName = 'sizes' | 'priorities' | 'statuses';

interface Props {
  projectDetails: {
    name: string;
    description: string;
    readme: string;
  };
}

type ProjectWithOptions = {
  name: string;
  description: string;
  readme: string;
  statuses?: ICustomFieldData[];
  sizes?: ICustomFieldData[];
  priorities?: ICustomFieldData[];
  labels?: ICustomFieldData[];
};

export const CreateProjectModal = ({ projectDetails }: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();
  const router = useRouter();
  const { toast } = useToast();
  const [statuses, setStatuses] = useState(defaultStatuses);
  const [sizes, setSizes] = useState(defaultSizes);
  const [priorities, setPriorities] = useState(defaultPriorities);
  const [labels, setLabels] = useState(defaultLabels);
  const [showNewLabelCard, setShowNewLabelCard] = useState(false);
  const [skipDefaultOptions, setSkipDefaultOption] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const AddNewOptionBtn = (
    <Button className={cn(secondaryBtnStyles, 'h-7 px-2 rounded-sm mr-2')}>
      <Plus className="w-4 h-4 mr-1" />
      New
    </Button>
  );

  const handleAddNewOptionItem = (
    data: Partial<Omit<ICustomFieldData, 'id'>>,
    state: CustomFieldDBTableName
  ) => {
    const filled = {
      id: uid(),
      name: (data as any).name ?? '',
      description: (data as any).description ?? '',
      color: (data as any).color ?? '',
    } as unknown as ICustomFieldData;

    switch (state) {
      case 'sizes':
        setSizes([...sizes, filled]);
        break;
      case 'priorities':
        setPriorities([...priorities, filled]);
        break;
      case 'statuses':
        setStatuses([...statuses, filled]);
        break;
      default:
        break;
    }
  };

  const handleAddNewLabelItem = (data: ICustomFieldData) => {
    setLabels([...labels, data]);
    setShowNewLabelCard(false);
  };

  const handleRemoveLabelItem = (id: string) => {
    setLabels(labels.filter((item) => item.id !== id));
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const projectData = {
        ...projectDetails,
        ...(skipDefaultOptions
          ? {}
          : {
              statuses,
              sizes,
              priorities,
              labels,
            }),
      };

      const project = await projects.management.create(
        projectData as ProjectWithOptions,
        session.user.id
      );

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });

      closeModal();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create project. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogTrigger
        onClick={openModal}
        className={cn(
          successBtnStyles,
          'w-28 flex items-center justify-center',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        disabled={!projectDetails.name}
      >
        Continue
      </DialogTrigger>
      <DialogContent className="md:min-w-[90%] lg:min-w-[70%] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{projectDetails.name}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Customize default options for your project.
        </DialogDescription>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-150 overflow-y-auto p-2">
          <CustomFieldOptions
            title="Sizes"
            field="size"
            options={sizes}
            setOptions={setSizes as unknown as any}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateCustomFieldOptionModal
                title="Create new size option"
                handleSubmit={(data) => handleAddNewOptionItem(data, 'sizes')}
                triggerBtn={AddNewOptionBtn}
                action="create-new-project"
              />
            }
          />
          <CustomFieldOptions
            title="Priorities"
            field="priority"
            options={priorities}
            setOptions={setPriorities as unknown as any}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateCustomFieldOptionModal
                title="Create new priority option"
                handleSubmit={(data) =>
                  handleAddNewOptionItem(data, 'priorities')
                }
                triggerBtn={AddNewOptionBtn}
                action="create-new-project"
              />
            }
          />
          <CustomFieldOptions
            title="Columns"
            field="status"
            options={statuses}
            setOptions={setStatuses as unknown as any}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateCustomFieldOptionModal
                title="Create new status option"
                handleSubmit={(data) =>
                  handleAddNewOptionItem(data, 'statuses')
                }
                triggerBtn={AddNewOptionBtn}
                action="create-new-project"
              />
            }
          />
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-lg py-3">Labels</h1>
              <Button
                onClick={() => setShowNewLabelCard(true)}
                className={cn(secondaryBtnStyles, 'h-7 px-2 rounded-sm mr-2')}
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>

            {showNewLabelCard && (
              <CreateOrEditLabelForm
                save={(data) =>
                  handleAddNewLabelItem({ ...data, description: data.description ?? '', color: data.color ?? '' })
                }
                cancel={() => setShowNewLabelCard(false)}
              />
            )}

            <div className="rounded border">
              <LabelList
                labels={labels}
                hiddenDescription
                onLabelDeleted={handleRemoveLabelItem}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Checkbox
            checked={skipDefaultOptions}
            onClick={() => setSkipDefaultOption(!skipDefaultOptions)}
          />
          <Label>Skip Default options. I will create my own options</Label>
        </div>

        <DialogFooter>
          <div className="flex justify-end">
            <Button
              onClick={handleCreateProject}
              className={cn(successBtnStyles, 'w-28')}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
