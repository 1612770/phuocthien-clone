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
      <Link href={href} passHref>
        <a>
          <span className={` cursor-pointer ${className}`}>{children}</span>
        </a>
      </Link>
    );
  } else {
    return <>{children}</>;
  }
}

export default LinkWrapper;
