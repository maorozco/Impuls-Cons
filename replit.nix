{ pkgs }: {
  deps = [
    # Node 20 + corepack (Node's built-in package manager switcher provides
    # pnpm without needing a separate nixpkgs attribute — `pkgs.pnpm` does
    # not exist on the stable-24_05 channel).
    pkgs.nodejs_20
    pkgs.corepack_20

    # Python 3.11 + pip for FastAPI ml-api dependencies
    pkgs.python311
    pkgs.python311Packages.pip

    # Postgres client libs — needed by psycopg2-binary build + psql CLI for
    # diagnostics. libpq (not libpqxx) is what the Python driver links.
    pkgs.postgresql_16

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

    # git for fetchgit sources (some transitive deps pull from git)
    pkgs.git
  ];

  env = {
    LANG = "en_US.UTF-8";
    LC_ALL = "en_US.UTF-8";
  };
}
