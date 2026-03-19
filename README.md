# step 1
```
npm init -y
```

# step 2
Core Dependencies (need for production)
```
npm install express mongoose cors dotenv bcrypt jsonwebtoken
```

Development Dependencies(for TypeScript support and auto-reloading)
```
npm install -D typescript ts-node-dev @types/express @types/node @types/cors @types/bcrypt @types/jsonwebtoken
```

- `-D` means development dependencies. nothing to do with production code. these files help for development.

# step 3
Initialize a **TypeScript** project by creating a `tsconfig.json` file
```
npx tsc --init
```