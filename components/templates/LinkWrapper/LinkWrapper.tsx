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
      <span className={className}>
        <Link href={href} passHref prefetch={false}>
          <a className="text-primary">{children}</a>
        </Link>
      </span>
    );
  }

  return <>{children}</>;
}

export default LinkWrapper;
