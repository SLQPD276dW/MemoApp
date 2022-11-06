import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  content: string;
  isHidden: boolean;
};

const Preview = (props: Props) => {
  return (
    <div
      className="border-bg-base-content rounded-lg border-2 border-solid text-2xl"
      hidden={props.isHidden}
    >
      <ReactMarkdown className="prose p-3">{props.content}</ReactMarkdown>
    </div>
  );
};

export default Preview;
