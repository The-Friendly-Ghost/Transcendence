/* Import Components */
import { Root } from 'postcss';
import { Metadata } from 'next';
import Navbar from '@components/nav';

/* Import Global Variables */
import { userLoggedIn } from '@app/g_vars';

export const metadata: Metadata = {
	title: "Transcendence",
  	description: "The Pong Experience",
}

export default function RootLayout({ children, }: { children: React.ReactNode }) 
{
	return (
	  <html lang="en">
		<body className="container_full_background">
			{ userLoggedIn && <Navbar /> }
			{ children }
		</body>
	  </html>
	)
}
