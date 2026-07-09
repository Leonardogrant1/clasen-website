export default async function FunnelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex">{children}</div>
    </div>
  )
}
