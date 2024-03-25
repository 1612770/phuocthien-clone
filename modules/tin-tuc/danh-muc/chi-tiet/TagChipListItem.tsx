import { Tag } from '@configs/models/cms.model';
import LinkWrapper from '@components/templates/LinkWrapper';

function TagChipListItem({ tag }: { tag: Tag }) {
  return (
    <LinkWrapper>
      <div className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600">
        #{tag.title}
      </div>
    </LinkWrapper>
  );
}

export default TagChipListItem;
