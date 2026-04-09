import { Directory, File, Paths } from "expo-file-system";

export const WORKSPACE = new Directory(Paths.document, "workspace");
type FSResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

//Check for vir Workspace, if not create one to work in
export function initWorkspace(): void {
    if (!WORKSPACE.exists) {
        WORKSPACE.create({ intermediates: true });
    }
}

//creating project
export function createProject(name: string): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, name);
        if (projectDir.exists)
            return {
                ok: false,
                error: "Project with this name already exists",
            };
        projectDir.create({ intermediates: true });

        //meta info for project
        const meta = new File(projectDir, "project.json");
        meta.create();
        meta.write(
            JSON.stringify(
                {
                    name,
                    description: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                null,
                2,
            ),
        );
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//list projects
export function listProjects(): FSResult<string[]> {
    try {
        if (!WORKSPACE.exists) return { ok: true, data: [] };

        const projects = WORKSPACE.list()
            .filter((item) => item instanceof Directory)
            .map((item) => item.name);
        return { ok: true, data: projects };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//deleteProject
export function deleteProject(name: string): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, name);
        if (projectDir.exists) {
            projectDir.delete();
        }
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//print projectMeta
export function getProjectMeta(name: string): FSResult<object> {
    try {
        const meta = new File(new Directory(WORKSPACE, name), "project.json");
        if (!meta.exists)
            return { ok: false, error: "meta doesnt exist for this project" };
        return { ok: true, data: JSON.parse(meta.textSync()) };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//update project meta
export function updateProjectMeta(
    name: string,
    updates: Partial<{
        name: string;
        description: string;
    }>,
): FSResult {
    try {
        const meta = new File(new Directory(WORKSPACE, name), "project.json");
        if (!meta.exists)
            return { ok: false, error: "meta doesnt exist for this project" };
        const current = JSON.parse(meta.textSync());
        meta.write(
            JSON.stringify(
                {
                    ...current,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                },
                null,
                2,
            ),
        );
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//create a file
export function createFile(
    projectName: string,
    relativePath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const file = new File(projectDir, relativePath);
        if (file.exists)
            return {
                ok: false,
                error: "Project with this name already exists",
            };
        file.create({ intermediates: true });
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//read file
export function readFile(
    projectName: string,
    relativePath: string,
): FSResult<string> {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const file = new File(projectDir, relativePath);
        if (!file.exists) return { ok: false, error: "File does not exist" };
        return { ok: true, data: file.textSync() };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//write file
export function writeFile(
    projectName: string,
    relativePath: string,
    content: string, //shit to add in
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const file = new File(projectDir, relativePath);
        if (!file.exists) return { ok: false, error: "File does not exist" };
        file.write(content);
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//delete File
export function deleteFile(
    projectName: string,
    relativePath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const file = new File(projectDir, relativePath);
        if (!file.exists) return { ok: false, error: "File does not exist" };
        if (file.exists) {
            file.delete();
        }
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//createFolder
export function createFolder(
    projectName: string,
    relativePath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const folder = new Directory(projectDir, relativePath);
        if (folder.exists) return { ok: false, error: "Folder already exists" };

        folder.create({ intermediates: true });
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//delete Folder
export function deleteFolder(
    projectName: string,
    relativePath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const folder = new Directory(projectDir, relativePath);
        if (!folder.exists)
            return { ok: false, error: "Folder does not exist" };

        if (folder.exists) {
            folder.delete();
        }
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//list Directories
export function listDirectories(
    projectName: string,
    relativePath: string,
): FSResult<{ files: string[]; folders: string[] }> {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project does not exist" };
        const folder = new Directory(projectDir, relativePath);
        if (!folder.exists)
            return { ok: false, error: "Folder does not exist" };
        const contents = folder.list();
        //files
        const files = contents
            .filter((item) => !(item instanceof Directory))
            .map((item) => item.name);
        //folders
        const folders = contents
            .filter((item) => item instanceof Directory)
            .map((item) => item.name);
        return { ok: true, data: { files, folders } };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//rename files and folders
export function rename(
    projectName: string,
    relativePath: string,
    newName: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const asFile = new File(projectDir, relativePath);

        if (asFile.exists) {
            asFile.rename(newName);
            return { ok: true, data: undefined };
        }
        const asFolder = new Directory(projectDir, relativePath);
        if (asFolder.exists) {
            asFolder.rename(newName);
            return { ok: true, data: undefined };
        }
        return { ok: false, error: "Path not found" };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//move file
export function moveFile(
    projectName: string,
    relativePath: string,
    destinationPath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project Does not Exist" };
        const file = new File(projectDir, relativePath);
        const destination = new Directory(projectDir, destinationPath);
        if (!file.exists) {
            return { ok: false, error: "File does not exist" };
        }
        if (!destination.exists) {
            return { ok: false, error: "Destination does not exist" };
        }
        file.move(destination);
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

export function moveFolder(
    projectName: string,
    relativePath: string,
    destinationPath: string,
): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, projectName);
        if (!projectDir.exists)
            return { ok: false, error: "Project does not exist" };
        const folder = new Directory(projectDir, relativePath);
        if (!folder.exists)
            return { ok: false, error: "Folder does not exist" };
        const destination = new Directory(projectDir, destinationPath);
        if (!destination.exists)
            return { ok: false, error: "Destination does not exist" };
        folder.move(destination);
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

//rename Project
export function renameProject(oldName: string, newName: string): FSResult {
    try {
        const projectDir = new Directory(WORKSPACE, oldName);
        if (!projectDir.exists) {
            return { ok: false, error: "Project does not exist" };
        }
        const newProjectDir = new Directory(WORKSPACE, newName);
        if (newProjectDir.exists) {
            return {
                ok: false,
                error: "A project with that name already exists",
            };
        }
        projectDir.rename(newName);
        updateProjectMeta(newName, { name: newName });
        return { ok: true, data: undefined }; // missing this
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}
