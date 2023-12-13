import { debounce } from '@/common/utils';
import { useEffect } from 'react';
import useTags from './useTags';

const TagList = ({ id, tags  }) => {
  const { handleClickTag } = useTags();

  useEffect(() => {
    const handleResize = () => {
      const parentDiv = document.getElementById(id);
      if (!parentDiv) {
        return;
      }
      const parentMaxWidth = parentDiv.offsetWidth;
      parentDiv.innerHTML = '';
      
      const marginRight = 8;
      const appendChild = (parent, tag) => {
        const tagDiv = document.createElement('div');
        tagDiv.textContent = tag;
        tagDiv.onclick = handleClickTag;

        tagDiv.style.padding = `0 ${marginRight}px`;
        tagDiv.style.whiteSpace = 'nowrap';
        tagDiv.style.borderRight = '1px solid grey';
        tagDiv.style.marginTop = '6px';
        tagDiv.style.marginBottom = '6px';
        tagDiv.style.cursor = 'pointer';

        parent.appendChild(tagDiv);
        return tagDiv
      };

      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const tagDiv = appendChild(parentDiv, tag);


        // eslint-disable-next-line no-unused-vars
        const forcedReflow = tagDiv.offsetWidth;

        const tagRightEdge = tagDiv.offsetLeft + tagDiv.offsetWidth + marginRight;
        const parentRightEdge = parentDiv.offsetLeft + parentMaxWidth;

        if (tagRightEdge > parentRightEdge) {
          parentDiv.removeChild(tagDiv);
          const countDiv = appendChild(parentDiv, '+' + (tags.length - i));
          const countRightEdge = countDiv.offsetLeft + countDiv.offsetWidth;
          if (countRightEdge > parentRightEdge) {
            parentDiv.removeChild(countDiv);
            parentDiv.removeChild(parentDiv.children[i -1]);
            appendChild(parentDiv, '+' + (tags.length - parentDiv.children.length));
          }
          return;
        }
      }
    };

    const debounceHandle= debounce(handleResize, 100);
    debounceHandle();
    window.addEventListener('resize', debounceHandle);

    return () => {
      window.removeEventListener('resize', debounceHandle);
    };
  }, [id, tags, handleClickTag]);

  //tags will be added dynamicly according to div total width
  return (
    <div
      id={id}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        height: '28px',
        fontSize: '12px'
      }}
    >
    </div>
  );
};

export default TagList;