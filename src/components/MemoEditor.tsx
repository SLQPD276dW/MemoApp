import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import type { EditorType } from 'types/EditorType';

type Props = {
  content: string;
  editorType: EditorType;
  onCodeChange: (code: string) => void;
  isHidden: boolean;
};

const MemoEditor = (props: Props) => {
  return (
    <div
      className="border-bg-base-content rounded-lg border-2 border-solid"
      hidden={props.isHidden}
    >
      <Editor
        value={props.content}
        onValueChange={(code) => props.onCodeChange(code)}
        highlight={(code) => Prism.highlight(code, Prism.languages.md, 'md')}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 24,
        }}
      />
    </div>
  );
};

export default MemoEditor;
