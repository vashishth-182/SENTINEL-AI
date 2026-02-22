FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: building the app requires build arguments for PUBLIC env vars
# Here we use dev server for simplicity as env vars are injected at runtime
# CMD ["npm", "run", "dev"]

# If production build is desired, uncomment:
# RUN npm run build
# CMD ["npm", "start"]

CMD ["npm", "run", "dev"]
