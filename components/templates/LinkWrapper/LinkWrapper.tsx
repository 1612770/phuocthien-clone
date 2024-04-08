import { useRouter } from 'next/router';

function LinkWrapper({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const router = useRouter();
  if (href) {
    return (
      <span
        onClick={() => router.push(href)}
        className={` cursor-pointer ${className}`}
      >
        {children}
      </span>
    );
  } else {
    return <>{children}</>;
  }
}

export default LinkWrapper;
