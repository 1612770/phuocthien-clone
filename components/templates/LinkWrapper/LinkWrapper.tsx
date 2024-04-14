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
      <span className={` ${className}`}>
        <Link href={href} passHref>
          <a>{children}</a>
        </Link>
      </span>
    );
  } else {
    return <>{children}</>;
  }
}

export default LinkWrapper;
