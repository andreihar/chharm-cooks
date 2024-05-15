import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import { History } from '@tiptap/extension-history';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Heading } from '@tiptap/extension-heading';
import { ListItem } from '@tiptap/extension-list-item';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Blockquote } from '@tiptap/extension-blockquote';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { faItalic } from '@fortawesome/free-solid-svg-icons';

function Tiptap() {
  const content = `
  <h2>
    Hi there,
  </h2>
  <p>
    this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>
      That’s a bullet list with one …
    </li>
    <li>
      … or two list items.
    </li>
  </ul>
  <p>
    Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
  <pre><code class="language-css">body {
  display: none;
  }</code></pre>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that’s amazing. Good work, boy! 👏
    <br />
    — Mom
  </blockquote>
  `;

  const extensions = [
    History, Document, Text, Bold, Italic,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'fs-5',
      }
    }),
    Heading, ListItem, BulletList, OrderedList, HardBreak,
    Blockquote.configure({
      HTMLAttributes: {
        class: 'blockquote-footer',
      },
    }),
  ];

  const editor = useEditor({ extensions, content });

  const toggleBold = useCallback(() => {
    if (editor)
      editor.chain().focus().toggleBold().run();
  }, [editor]);
  const toggleItalic = useCallback(() => {
    if (editor)
      editor.chain().focus().toggleItalic().run();
  }, [editor]);

  return (
    <>
      <BubbleMenu pluginKey="bubbleMenuText" tippyOptions={{ duration: 150 }} editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => { return from !== to; }}
      >
        <button onClick={toggleBold}>
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button onClick={toggleItalic}>
          <FontAwesomeIcon icon={faItalic} />
        </button>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </>
  );
}

export default Tiptap;
