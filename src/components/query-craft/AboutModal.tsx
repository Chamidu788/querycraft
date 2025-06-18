
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { InfoIcon, UsersIcon, BuildingIcon, Wand2Icon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AboutModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" aria-label="About & How to Use QueryCraft SQL">
          <InfoIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary flex items-center gap-2">
            <InfoIcon className="h-6 w-6" /> About QueryCraft SQL & How to Use
            </DialogTitle>
          <DialogDescription>
            Your visual assistant for crafting, understanding, and managing SQL queries with ease, now with AI-powered features!
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4 my-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg text-primary-foreground/90 mb-2">What is QueryCraft SQL?</h3>
              <p className="text-muted-foreground leading-relaxed">
                QueryCraft SQL is a user-friendly web application designed to help you visually construct SQL (Structured Query Language) queries without needing to write complex code from scratch. It's perfect for learners, developers who want to speed up their workflow, or anyone who interacts with databases.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                You can define your database table structure, select the type of query you want to perform (like fetching, adding, updating, or deleting data), and QueryCraft will generate the corresponding SQL statement for you. It also helps you save your queries, simulate common errors to get AI-powered suggestions for fixes, and even generate SQL from plain English descriptions!
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary-foreground/90 mb-2">How to Use QueryCraft SQL:</h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground leading-relaxed">
                <li>
                  <strong>Define Your Table:</strong>
                  In the "Table & Column Builder" section, enter a name for your table (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">users</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">products</code>).
                </li>
                <li>
                  <strong>Add Columns:</strong>
                  Click "Add New Column". For each column:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li>Enter a <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Name</code> (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">id</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">email</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">quantity</code>).</li>
                    <li>Select a data <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Type</code> (e.g., INT, VARCHAR, DATETIME).</li>
                    <li>Choose any <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Constraints</code> (e.g., PRIMARY KEY, NOT NULL).</li>
                    <li>Provide an <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Example Value</code>. This is used when generating INSERT or UPDATE queries.</li>
                  </ul>
                </li>
                <li>
                  <strong>Select Query Type:</strong>
                  Use the "Query Type" dropdown to choose what kind of operation you want to perform:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">SELECT</code>: To retrieve data.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">INSERT</code>: To add new data.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">UPDATE</code>: To modify existing data.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">DELETE</code>: To remove data.</li>
                  </ul>
                </li>
                <li>
                  <strong>View Generated Query:</strong>
                  The "Generated SQL Query" section will automatically update with the SQL statement based on your inputs. You can copy it using the copy icon.
                </li>
                <li>
                  <strong>Generate CREATE TABLE (Optional):</strong>
                  Click the "Generate CREATE TABLE" button to get the SQL statement for creating your defined table structure.
                </li>
                <li>
                  <strong>Save Your Query:</strong>
                  Optionally, give your query a name in the "Query Name" field and click "Save Query". This helps you reuse or reference it later. If you load a saved query, this button becomes "Update Saved Query".
                </li>
                <li>
                  <strong>Manage Saved Queries:</strong>
                  The "Saved Queries Management" section lists all your saved queries. You can:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li>Click a query name or the load icon to load its settings back into the builder.</li>
                    <li>Edit a query's name.</li>
                    <li>Delete a query.</li>
                    <li>Export all saved queries to a <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">.sql</code> file.</li>
                  </ul>
                </li>
                <li>
                  <strong>Use Natural Language to SQL (AI Powered):</strong>
                  <Wand2Icon className="inline-block h-4 w-4 mr-1 text-accent" />
                  In the "Natural Language to SQL" section, describe what you want the query to do in plain English (e.g., "show all products with price less than 50" or "add a new user named Jane with email jane@example.com"). Click "Generate SQL from Text", and the AI will attempt to create the SQL query for you based on your current table and column setup.
                </li>
                <li>
                  <strong>SQL Error Helper:</strong>
                  In the "SQL Error Helper" section, you can click `Simulate "Table Not Found"` to see a common SQL error and get an AI-powered suggestion for a <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">CREATE TABLE</code> statement to fix it.
                </li>
              </ol>
            </section>
            
            <hr className="my-8 border-border" />

            <section>
              <h3 className="font-semibold text-lg text-primary-foreground/90 mb-2">QueryCraft SQL යනු කුමක්ද? (සින්හලෙන්)</h3>
              <p className="text-muted-foreground leading-relaxed">
                QueryCraft SQL කියන්නේ SQL (Structured Query Language) විමසුම් (queries) පහසුවෙන්, කේත (code) ලියන්නෙ නැතුව දෘශ්‍යමය වශයෙන් (visually) හදන්න පුළුවන් වෙබ් යෙදුමක් (web application). දැන් AI බලයෙන් ක්‍රියාත්මක වන විශේෂාංග සමඟින්!
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                මේක ඉගෙන ගන්න අයට, ඉක්මනට වැඩ කරගන්න ඕන මෘදුකාංග සංවර්ධකයින්ට (developers), සහ දත්ත සමුදායන් (databases) එක්ක වැඩ කරන ඕනම කෙනෙක්ට ගොඩක් ප්‍රයෝජනවත්. ඔබට ඔබේ දත්ත වගු (tables) හදන්න, දත්ත ලබාගැනීම (SELECT), අලුතින් එකතු කිරීම (INSERT), යාවත්කාලීන කිරීම (UPDATE), හෝ ඉවත් කිරීම (DELETE) වගේ විමසුම් වර්ග තෝරන්න පුළුවන්. QueryCraft එකෙන් SQL ප්‍රකාශ (statements) හදල දෙනවා, ඒවා සේව් (save) කරගන්න පුළුවන්, වැරදි අනුකරණය (simulate errors) කරලා AI එකෙන් විසඳුම් ගන්නත්, සාමාන්‍ය ඉංග්‍රීසි භාෂාවෙන් SQL හදාගන්නත් පුළුවන්!
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary-foreground/90 mb-2">QueryCraft SQL භාවිතා කරන්නේ කෙසේද: (සින්හලෙන්)</h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground leading-relaxed">
                <li>
                  <strong>ඔබේ වගුව (Table) හදන්න:</strong>
                  "Table & Column Builder" (වගු සහ තීරු සාදන්නා) කොටසේ, ඔබේ වගුවේ නම (උදා: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">පරිශීලකයන්</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">නිෂ්පාදන</code>) ඇතුළත් කරන්න.
                </li>
                <li>
                  <strong>තීරු (Columns) එකතු කරන්න:</strong>
                  "Add New Column" (අලුත් තීරුවක් එක් කරන්න) ඔබන්න. එක් එක් තීරුව සඳහා:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li>නමක් (<code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Name</code>) (උදා: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">id</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">email</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">quantity</code>) ඇතුළත් කරන්න.</li>
                    <li>දත්ත වර්ගයක් (<code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Type</code>) (උදා: INT, VARCHAR, DATETIME) තෝරන්න.</li>
                    <li>ඕනෑම කොන්දේසි (<code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Constraints</code>) (උදා: PRIMARY KEY, NOT NULL) තෝරන්න.</li>
                    <li>උදාහරණ අගයක් (<code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Example Value</code>) දෙන්න. <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">INSERT</code> හෝ <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">UPDATE</code> විමසුම් හදද්දී මේක පාවිච්චි වෙනවා.</li>
                  </ul>
                </li>
                <li>
                  <strong>විමසුම් වර්ගය (Query Type) තෝරන්න:</strong>
                  "Query Type" (විමසුම් වර්ගය) dropdown එකෙන් ඔබට අවශ්‍ය ක්‍රියාව තෝරන්න:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">SELECT</code>: දත්ත ලබාගැනීමට.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">INSERT</code>: අලුත් දත්ත එකතු කිරීමට.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">UPDATE</code>: පවතින දත්ත වෙනස් කිරීමට.</li>
                    <li><code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">DELETE</code>: දත්ත ඉවත් කිරීමට.</li>
                  </ul>
                </li>
                <li>
                  <strong>සැකසූ විමසුම (Generated Query) බලන්න:</strong>
                  "Generated SQL Query" (සැකසූ SQL විමසුම) කොටසේ ඔබ හදපු SQL ප්‍රකාශය පෙන්වයි. කොපි (copy) අයිකන් එකෙන් ඒක කොපි කරගන්න පුළුවන්.
                </li>
                <li>
                  <strong>CREATE TABLE විමසුම සාදන්න (අත්‍යවශ්‍ය නොවේ):</strong>
                  "Generate CREATE TABLE" (CREATE TABLE විමසුම සාදන්න) බොත්තම ඔබලා, ඔබ හදපු වගුව නිර්මාණය කිරීමේ SQL ප්‍රකාශය ගන්න.
                </li>
                <li>
                  <strong>ඔබේ විමසුම සේව් (Save) කරගන්න:</strong>
                  "Query Name" (විමසුමේ නම) තැන නමක් දීලා "Save Query" (විමසුම සේව් කරන්න) ඔබන්න. පස්සේ පාවිච්චි කරන්න ලේසියි. සේව් කරපු විමසුමක් load කළොත්, මේ බොත්තම "Update Saved Query" (සේව් කළ විමසුම යාවත්කාලීන කරන්න) ලෙස වෙනස් වේ.
                </li>
                <li>
                  <strong>සේව් කළ විමසුම් කළමනාකරණය (Manage Saved Queries):</strong>
                  "Saved Queries Management" (සේව් කළ විමසුම් කළමනාකරණය) කොටසේ ඔබ සේව් කරපු හැම විමසුමක්ම පෙන්වයි. ඔබට පුළුවන්:
                  <ul className="list-disc list-inside ml-5 mt-1.5 space-y-1.5">
                    <li>විමසුමක නම හෝ load අයිකන් එක ඔබලා ඒකෙ සැකසුම් ආයෙත් builder එකට ගන්න.</li>
                    <li>විමසුමක නම වෙනස් කරන්න.</li>
                    <li>විමසුමක් මකා දාන්න.</li>
                    <li>සේව් කරපු හැම විමසුමක්ම <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">.sql</code> ෆයිල් එකකට export කරගන්න.</li>
                  </ul>
                </li>
                <li>
                  <strong>AI සහාය ඇතිව ස්වභාවික භාෂාවෙන් SQL සෑදීම:</strong>
                  <Wand2Icon className="inline-block h-4 w-4 mr-1 text-accent" />
                  "Natural Language to SQL" (ස්වභාවික භාෂාවෙන් SQL වෙත) කොටසේ, ඔබට අවශ්‍ය විමසුම (query) සාමාන්‍ය ඉංග්‍රීසියෙන් (උදා: "show all products with price less than 50" හෝ "add a new user named Jane with email jane@example.com") ටයිප් කරන්න. ඉන්පසු "Generate SQL from Text" බොත්තම ඔබන්න. ඔබගේ වත්මන් වගුව (table) සහ තීරු (columns) අනුව AI මගින් SQL විමසුමක් සෑදීමට උත්සාහ කරනු ඇත.
                </li>
                <li>
                  <strong>SQL දෝෂ උදව්කරු (SQL Error Helper):</strong>
                  "SQL Error Helper" (SQL දෝෂ උදව්කරු) කොටසේ, <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">Simulate "Table Not Found"</code> (වගුව සොයාගත නොහැක දෝෂය අනුකරණය කරන්න) ඔබලා, සාමාන්‍ය SQL දෝෂයක් දැකගන්නත්, ඒක හදන්න AI එකෙන් <code className="bg-muted px-1.5 py-0.5 rounded-sm font-code text-xs">CREATE TABLE</code> ප්‍රකාශයක් ගන්නත් පුළුවන්.
                </li>
              </ol>
            </section>

            <hr className="my-8 border-border" />

            <section>
              <h3 className="font-semibold text-lg text-primary-foreground/90 mb-2 flex items-center gap-2">
                <UsersIcon className="h-5 w-5" /> Developers &amp; <BuildingIcon className="h-5 w-5" /> Company Information
              </h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <div>
                  <strong>Developers:</strong>
                  <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                    <li>
                      Chamindu Kavishka: <a href="https://chamindu1.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">chamindu1.vercel.app</a>
                    </li>
                    <li>
                      Maheshika Devindya: <a href="https://maheshika1.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">maheshika1.vercel.app</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>Company:</strong>
                  <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                    <li>
                      MC Digital Innovate: <a href="https://mcdi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">mcdi.vercel.app</a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
          
            
            <p className="text-sm text-center text-muted-foreground/80 pt-4">Happy Query Crafting!</p>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
    
