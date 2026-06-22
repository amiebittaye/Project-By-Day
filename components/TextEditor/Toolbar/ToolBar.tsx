import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/react';
import {
  AtSign,
  Bold,
  Braces,
  Code,
  Italic,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';
import { AlignMenu } from './AlignMenu';
import HeadingMenu from './HeadingMenu';
import { ToolbarIconButton } from './IconButton';

export const ToolBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const handleBold = () => {
    // use the generic toggleMark command to toggle bold (avoids missing chain helper)
    editor.chain().focus().toggleMark('bold').run();
  };

  const handleItalic = () => {
    // use the generic toggleMark command to toggle italic (avoids missing chain helper)
    editor.chain().focus().toggleMark('italic').run();
  };

  const handleUnderline = () => {
    // use the generic toggleMark command to toggle underline (avoids missing chain helper)
    editor.chain().focus().toggleMark('underline').run();
  };

  const handleCode = () => {
    // use the generic toggleMark command to toggle inline code (avoids missing chain helper)
    editor.chain().focus().toggleMark('code').run();
  };

  const handleBulletList = () => {
    editor.chain().focus().toggleList('bulletList', 'listItem').run();
  };

  const handleOrderedList = () => {
    editor.chain().focus().toggleList('orderedList', 'listItem').run();
  };

  const handleCodeBlock = () => {
    editor.chain().focus().toggleNode('codeBlock', 'paragraph').run();
  };

  const handleAtSign = () => {
    editor.commands.insertContent('@');
  };

  return (
    <div className="flex items-center space-x-2 px-2">
      <HeadingMenu editor={editor} />
      <ToolbarIconButton
        onClick={handleBold}
        isActive={editor.isActive('bold')}
        title="bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleItalic}
        isActive={editor.isActive('italic')}
        title="italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleUnderline}
        isActive={editor.isActive('underline')}
        title="underline"
      >
        <Underline className="w-4 h-4" />
      </ToolbarIconButton>
      <Separator orientation="vertical" className="h-7" />

      <ToolbarIconButton
        onClick={handleCode}
        isActive={editor.isActive('code')}
        title="code"
      >
        <Code className="w-4 h-4" />
      </ToolbarIconButton>

      <Separator orientation="vertical" className="h-7" />
      <AlignMenu editor={editor} />
      <Separator orientation="vertical" className="h-7" />

      <ToolbarIconButton
        onClick={handleBulletList}
        isActive={editor.isActive('bulletList')}
        title="bullet list"
      >
        <List className="w-4 h-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleOrderedList}
        isActive={editor.isActive('orderedList')}
        title="ordered list"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleCodeBlock}
        isActive={editor.isActive('codeBlock')}
        title="code block"
      >
        <Braces className="w-4 h-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleAtSign}
        isActive={false}
        title="@ Mentions"
      >
        <AtSign className="w-4 h-4" />
      </ToolbarIconButton>
    </div>
  );
};
