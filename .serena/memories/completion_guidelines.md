General Workflow:
1. Ensure code passes linting before committing:
   - Frontend: `cd frontend && npm run lint`
   - Backend: `cd backend && npm run lint`
2. Backend code formatting: `cd backend && npm run format`
3. Testing (Backend): `cd backend && npm run test` or `npm run test:e2e`
4. Ensure the build succeeds:
   - Frontend: `cd frontend && npm run build`
   - Backend: `cd backend && npm run build`