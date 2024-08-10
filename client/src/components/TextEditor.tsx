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
import { Image } from '@tiptap/extension-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faHeading, faT, faLink, faLinkSlash, faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

const TextEditor = forwardRef(({ content }: { content: string; }, ref) => {
	const [isAddingLink, setIsAddingLink] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');
	const [isAddingImage, setIsAddingImage] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const { t, i18n } = useTranslation();

	const extensions = [
		History, Document, Text, Bold, Italic, Link,
		Paragraph.configure({ HTMLAttributes: { class: 'fs-5' } }),
		Placeholder.configure({
			placeholder: t('form.editor'),
			considerAnyAsEmpty: false,
			showOnlyCurrent: true
		}),
		Heading.configure({ HTMLAttributes: { class: 'fw-bold' } }),
		Image.configure({ HTMLAttributes: { class: 'img-fluid w-75 mx-auto d-block' } }),
		ListItem, BulletList, OrderedList, HardBreak
	];

	const editor = useEditor({ extensions, content });

	useEffect(() => {
		if (editor) {
			editor.commands.setContent(content.replace(/<p>(<img[^>]+>)<\/p>/g, '$1'));
			console.log(content);
		}
	}, [content, editor]);

	useEffect(() => {
		if (editor) {
			const placeholderExtension = editor.extensionManager?.extensions.find(ext => ext.name === 'placeholder');
			if (placeholderExtension) {
				placeholderExtension.options.placeholder = t('form.editor');
				editor.commands.setContent(editor.getHTML());
			}
		}
	}, [i18n.language, editor, t]);

	useImperativeHandle(ref, () => ({
		getContent: () => editor?.getHTML() || '',
	}));

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

	function addImage(editor: Editor) {
		editor.chain().focus().setImage({ src: imageUrl }).run();
		setIsAddingImage(false);
		setImageUrl('');
	}

	function handleImageInputKeyDown(event: React.KeyboardEvent) {
		if (editor && event.key === 'Enter') {
			event.preventDefault();
			addImage(editor);
		}
	}

	function handleImageBlur() {
		editor && imageUrl ? addImage(editor) : setIsAddingImage(false);
	}

	return (
		<>
			<BubbleMenu className="Bubblemenu bg-dark rounded p-1 d-flex text-white" editor={editor} pluginKey="bubbleMenuText" tippyOptions={{ duration: 150 }}
				shouldShow={({ from, to }) => { return from !== to; }}>
				{isAddingLink ? (
					<input className="border-0 bg-dark text-white" type="text" placeholder={t('form.link')} value={linkUrl} onChange={event => setLinkUrl(event.target.value)} onKeyDown={handleLinkInputKeyDown} onBlur={() => setLink(editor)} style={{ outline: 'none' }} autoFocus />
				) : isAddingImage ? (
					<div className="d-flex flex-column align-items-start">
						<input className="border-0 bg-dark text-white mb-1" type="text" placeholder={t('form.picture')} value={imageUrl} onChange={event => setImageUrl(event.target.value)} onKeyDown={handleImageInputKeyDown} onBlur={handleImageBlur} style={{ outline: 'none' }} autoFocus />
					</div>
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
						<div style={{ width: '24px', height: '24px' }} className="mx-1 icon d-flex justify-content-center align-items-center rounded" onClick={() => setIsAddingImage(true)}>
							<FontAwesomeIcon icon={faImage} />
						</div>
					</>
				)}
			</BubbleMenu>
			<EditorContent editor={editor} />
		</>
	);
});

export default TextEditor;
