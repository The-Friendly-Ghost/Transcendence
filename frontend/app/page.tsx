/* Import Components */
import Dashboard from "@components/dashboard/dashboard";

/**
 * Function that returns the Home Page.
 * @returns A JSX Element that represents the Home Page.
 */
export default async function Home(): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-wrap justify-center">
      <Dashboard />
    </div>
  );
}
