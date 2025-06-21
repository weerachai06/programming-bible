import ServiceWorkerRegistration from "@/features/shared/components/service-worker-registration";

export default function ServiceWorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ServiceWorkerRegistration />
      {children}
    </>
  );
}
