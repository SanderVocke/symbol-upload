import { OptionDefinition as ArgDefinition } from "command-line-args";
import { OptionDefinition as UsageDefinition, Section } from "command-line-usage";

export type CommandLineDefinition = ArgDefinition & UsageDefinition;

export const argDefinitions: Array<CommandLineDefinition> = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    },
    {
        name: 'database',
        alias: 'b',
        type: String,
        typeLabel: '{underline string}',
        description: 'Your BugSplat database name.'
    },
    {
        name: 'application',
        alias: 'a',
        type: String,
        typeLabel: '{underline string}',
        description: 'The name of your application. The value of application must match the value used to post crash reports.',
    },
    {
        name: 'version',
        alias: 'v',
        type: String,
        typeLabel: '{underline string}',
        description: 'Your application\'s version. The value of version must match the value used to post crash reports.',
    },
    {
        name: 'user',
        alias: 'u',
        type: String,
        typeLabel: '{underline string} (optional)',
        description: 'The email address used to log into your BugSplat account. If provided --password must also be provided. This value can also be provided via the SYMBOL_UPLOAD_USER environment variable.',
    },
    {
        name: 'password',
        alias: 'p',
        type: String,
        typeLabel: '{underline string} (optional)',
        description: 'The password for your BugSplat account. If provided --user must also be provided. This value can also be provided via the SYMBOL_UPLOAD_PASSWORD environment variable.',
    },
    {
        name: 'remove',
        alias: 'r',
        type: Boolean,
        description: 'Removes symbols for a specified database, application, and version. If this option is provided no other actions are taken.'
    },
    {
        name: 'files',
        alias: 'f',
        type: String,
        defaultValue: '*.js.map',
        typeLabel: '{underline string} (optional)',
        description: 'Glob pattern that specifies a set of files to upload. Defaults to \'*.js.map\'',
    },
    {
        name: 'directory',
        alias: 'd',
        type: String,
        defaultValue: '.',
        typeLabel: '{underline string} (optional)',
        description: 'Path of the base directory used to search for symbol files. This value will be combined with the --files glob. Defaults to \'.\'',
    }
];

export const usageDefinitions: Array<Section> = [
    {
        header: '@bugsplat/symbol-upload',
        content: 'symbol-upload contains a command line utility and a set of libraries to help you upload symbol files to BugSplat.',
    },
    {
        header: 'Usage',
        optionList: argDefinitions
    },
    {
        content: 'The -u and -p arguments are not required if you set the environment variables SYMBOL_UPLOAD_USER and SYMBOL_UPLOAD_PASSWORD.'
    },
    {
        header: 'Example',
        content: [
            'symbol-upload -b {italic your-bugsplat-database} -a {italic your-application-name} -v {italic your-version} [ -f "*.js.map" -d "/path/to/containing/dir" -u {italic your-bugsplat-email} -p {italic your-bugsplat-password} ]',
        ]
    },
    {
        header: 'Links',
        content: 
        [
            '🐛 {underline https://bugsplat.com}',
            '',
            '💻 {underline https://github.com/BugSplat-Git/symbol-upload}',
            '',
            '💌 {underline support@bugsplat.com}'
        ]
    }
];