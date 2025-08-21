import Image from "next/image";

export default function Home() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '20px 1fr 20px',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      gap: '4rem'
    }}>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        gridRowStart: 2,
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol style={{
          fontFamily: 'monospace',
          listStyle: 'decimal inside',
          fontSize: '0.875rem',
          lineHeight: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Get started by editing{" "}
            <code style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              fontFamily: 'monospace',
              fontWeight: '600',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem'
            }}>
              src/app/page.tsx
            </code>
            .
          </li>
          <li>
            Save and see your changes instantly.
          </li>
        </ol>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <a
            style={{
              borderRadius: '9999px',
              border: '1px solid transparent',
              transition: 'colors 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              gap: '0.5rem',
              fontWeight: '500',
              fontSize: '0.875rem',
              height: '2.5rem',
              padding: '0 1rem',
              textDecoration: 'none'
            }}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            style={{
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'colors 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '500',
              fontSize: '0.875rem',
              height: '2.5rem',
              padding: '0 1rem',
              textDecoration: 'none',
              color: 'var(--foreground)'
            }}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer style={{
        gridRowStart: 3,
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <a
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--foreground)'
          }}
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--foreground)'
          }}
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--foreground)'
          }}
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
