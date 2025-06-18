
import { config } from 'dotenv';
config();

import '@/ai/flows/sql-error-prompt.ts';
import '@/ai/flows/natural-language-to-sql-flow.ts'; // Register the new flow
