function Error({ statusCode }: { statusCode: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>
        {statusCode
          ? `Vui lòng tải lại trang và tiếp tục. ${statusCode} `
          : 'Vui lòng tải lại trang và tiếp tục'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res: unknown; err: unknown }) => {
  const statusCode = res
    ? (res as { statusCode: number }).statusCode
    : err
    ? (err as { statusCode: number }).statusCode
    : 404;
  return { statusCode };
};

export default Error;
