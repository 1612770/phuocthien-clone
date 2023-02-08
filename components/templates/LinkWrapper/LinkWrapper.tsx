import Link from 'next/link';

function LinkWrapper({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  if (href) {
    return (
      <Link href={href}>
        <a>{children}</a>
      </Link>
    );
  } else {
    return <>{children}</>;
  }
}

export default LinkWrapper;
