interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="alert alert-danger mt-4" role="alert">
      {message}
    </div>
  );
}
