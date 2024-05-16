import { EditorContent, BubbleMenu, Editor, useEditor } from '@tiptap/react';
import { History } from '@tiptap/extension-history';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Heading } from '@tiptap/extension-heading';
import { ListItem } from '@tiptap/extension-list-item';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { HardBreak } from '@tiptap/extension-hard-break';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faHeading, faT, faLink, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function TextEditor() {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { t } = useTranslation();

  const extensions = [
    History, Document, Text, Bold, Italic, Link,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'fs-5',
      }
    }),
    Placeholder.configure({
      placeholder: t('form.editor'),
      considerAnyAsEmpty: false,
      showOnlyCurrent: true
    }),
    Heading.configure({
      HTMLAttributes: {
        class: 'fw-bold',
      },
    }), ListItem, BulletList, OrderedList, HardBreak
  ];

  const editor = useEditor({ extensions });

  if (!editor) {
    return null;
  }

  const isSelectionOverLink = editor && editor.getAttributes('link').href;

  function setLink(editor: Editor) {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setIsAddingLink(false);
    setLinkUrl('');
  }

  function handleLinkInputKeyDown(event: React.KeyboardEvent) {
    if (editor && event.key === 'Enter') {
      event.preventDefault();
      setLink(editor);
    }
  }

  return (
    <>
      <BubbleMenu className="Bubblemenu bg-dark rounded p-1 d-flex text-white" editor={editor} pluginKey="bubbleMenuText" tippyOptions={{ duration: 150 }}
        shouldShow={({ from, to }) => { return from !== to; }}>
        {isAddingLink ? (
          <input className="border-0 bg-dark text-white" type="text" value={linkUrl} onChange={event => setLinkUrl(event.target.value)} onKeyDown={handleLinkInputKeyDown} onBlur={() => setLink(editor)} style={{ outline: 'none' }} autoFocus />
        ) : (
          <>
            <div style={{ width: '24px', height: '24px' }} className={`ms-1 icon d-flex justify-content-center align-items-center rounded ${editor.isActive('bold') ? 'text-primary' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()}>
              <FontAwesomeIcon icon={faBold} />
            </div>
            <div style={{ width: '24px', height: '24px' }} className={`ms-1 icon d-flex justify-content-center align-items-center rounded ${editor.isActive('italic') ? 'text-primary' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <FontAwesomeIcon icon={faItalic} />
            </div>
            <div style={{ width: '24px', height: '24px' }} className={`ms-1 icon d-flex justify-content-center align-items-center rounded ${editor.isActive('heading', { level: 2 }) ? 'text-primary' : ''}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <FontAwesomeIcon icon={faHeading} />
            </div>
            <div style={{ width: '24px', height: '24px' }} className={`ms-1 icon d-flex justify-content-center align-items-center rounded ${editor.isActive('heading', { level: 3 }) ? 'text-primary' : ''}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <FontAwesomeIcon icon={faT} />
            </div>
            <div style={{ width: '24px', height: '24px' }} className="mx-1 icon d-flex justify-content-center align-items-center rounded"
              onClick={() => {
                if (isSelectionOverLink) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  setIsAddingLink(true);
                }
              }}
            >
              {isSelectionOverLink ? <FontAwesomeIcon icon={faLinkSlash} /> : <FontAwesomeIcon icon={faLink} />}
            </div>
          </>
        )}
      </BubbleMenu>
      <EditorContent editor={editor} />
    </>
  );
}

export default TextEditor;
