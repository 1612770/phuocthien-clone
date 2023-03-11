import Link from 'next/link';

function LinkWrapper({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  if (href) {
    return (
      <Link href={href}>
        <a className={className}>{children}</a>
      </Link>
    );
  } else {
    return <>{children}</>;
  }
}

export default LinkWrapper;
