import { ActivityResponse } from '@/hooks/useActivityQueries';
import { v4 as uid } from 'uuid';

type CommentResponse = {
  created_at: string;
  [key: string]: any;
};

type TimelineType = 'activity' | 'comment';

interface ITimeline {
  id: string;
  created_at: Date;
  type: TimelineType;
  value: ActivityResponse | CommentResponse;
}

export const getTimelineItems = (
  activities: ActivityResponse[],
  comments: CommentResponse[]
) => {
  const timelineItems: ITimeline[] = [
    ...activities.map((activity) => ({
      id: uid(),
      created_at: new Date(activity.created_at ?? Date.now()),
      type: 'activity' as TimelineType,
      value: activity,
    })),

    ...comments.map((comment) => ({
      id: uid(),
      created_at: new Date(comment.created_at ?? Date.now()),
      type: 'comment' as TimelineType,
      value: comment,
    })),
  ].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  return timelineItems;
};
