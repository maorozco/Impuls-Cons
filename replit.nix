{ pkgs }: {
  deps = [
    # Node 20 + pnpm (pnpm is provisioned by the PNPM_WORKSPACE agent stack)
    pkgs.nodejs_20
    pkgs.pnpm

    # Python 3.11 + pip for FastAPI ml-api dependencies
    pkgs.python311
    pkgs.python311Packages.pip

    # Postgres client libs (needed by psycopg2-binary build + psql CLI for diagnostics)
    pkgs.postgresql_16
    pkgs.libpqxx

    # Build tools for sharp (image optimization) + scientific Python wheels
    pkgs.pkg-config
    pkgs.gcc
    pkgs.gnumake
    pkgs.cmake

    # Common locale support (glibcLocales) + CA certs for HTTPS outbound
    pkgs.glibcLocales
    pkgs.cacert

    # curl for healthchecks during deploy
    pkgs.curl
  ];

  env = {
    LANG = "en_US.UTF-8";
    LC_ALL = "en_US.UTF-8";
  };
}
