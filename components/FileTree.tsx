import { Theme, useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import {
    createFile,
    createFolder,
    listDirectories,
    rename
} from '@/utils/filesystem';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';



type Props = {
    projectName: string,
    onFileOpen: (relativePath: string) =>void;  
};

type TreeItemProps = {
  name: string;
  path: string;
  isFolder: boolean;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  theme: Theme;
  onPress: () => void;
  onLongPress: () => void;
};


function TreeItem({ name, path, isFolder, depth, isExpanded, isSelected, theme, onPress, onLongPress}: TreeItemProps){
    const styles = useMemo(() => ({
        row: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            paddingVertical: 3,
            paddingLeft: 8 + depth * 12,
            paddingRight: 8,
            backgroundColor: isSelected ? theme.accent + '33' : 'transparent',

        },
        name: {
            color: theme.text,
            fontSize: 13,
            marginLeft: 4,
            flex: 1,
        },
    }), [theme, depth, isSelected]);

    const icon = isFolder ? {name: isExpanded ? 'chevron-down': 'chevron-forward', color: theme.textSecondary} : getFileIcon(name, theme);

    return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={`${isFolder ? 'Folder' : 'File'} ${name}`}
    >
      <Ionicons name={icon.name as any} size={14} color={icon.color} />
      {isFolder && (
        <Ionicons
          name="folder"
          size={14}
          color={isExpanded ? '#e8b84b' : theme.textSecondary}
          style={{ marginLeft: 2 }}
        />
      )}
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );


}





function getFileIcon(name: string, theme: Theme): {name: string; color: string} {
    const ext = name.split('.').pop()?.toLowerCase();

    switch (ext) {
    case 'ts':
    case 'tsx':
      return { name: 'logo-react', color: '#007acc' };
    case 'js':
    case 'jsx':
      return { name: 'logo-javascript', color: '#f7df1e' };
    case 'css':
      return { name: 'logo-css3', color: '#9b59b6' };
    case 'html':
      return { name: 'logo-html5', color: '#e67e22' };
    case 'json':
      return { name: 'code-slash', color: '#f7df1e' };
    case 'md':
      return { name: 'document-text-outline', color: theme.text };
    default:
      return { name: 'document-outline', color: theme.textSecondary };
    }
}

export default function FileTree({ projectName, onFileOpen }: Props) {

    const theme = useTheme();

    const [collapsed, setCollapsed]  = useState(false);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [contents, setContents] = useState<Record<string, {files: string[]; folders: string[] }>>({});
    const [inlineInput, setInlineInput] = useState<{path: string; type: 'file' | 'folder' | 'rename'} | null>(null);
    const [sideBarWidth] = useState(new Animated.Value(250));
    const inputRef = useRef<TextInput>(null);

    

    

    const loadContents = useCallback(async (path: string) => {
        const result = listDirectories(projectName, path);
        if(result.ok) {
            setContents(prev => ({ ...prev, [path]: result.data}));
        }
    }, [projectName]);

    //toggling the folder as in enable/d9savkle insides
    const toggleFolder = useCallback((path: string) =>{
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)){
                next.delete(path);
            } else {
                next.add(path);
                loadContents(path);
            }
            return next;
        });
    }, [loadContents]);


    //collapsing side bar
    const toggleCollapse = useCallback(() => {
        const toValue = collapsed ? 250: 40;
        Animated.timing(sideBarWidth, {
            toValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        setCollapsed(prev=> !prev);
    }, [collapsed, sideBarWidth]);


    


    useEffect(()=> {
        loadContents('');

    }, [loadContents]);

    useEffect(() => {
        console.log('[FileTree] inlineInput useEffect fired, inlineInput:', inlineInput);
        console.log('[FileTree] inputRef.current:', inputRef.current);
        if (inlineInput) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [inlineInput]);

    const [inlineInputValue, setInlineInputValue] = useState('');
    const confirmInlineInput = useCallback(async () => {
        if (!inlineInput || !inlineInputValue.trim()) {
            setInlineInput(null);
            setInlineInputValue('');
            return;
        }
        const fullPath = inlineInput.path
            ? `${inlineInput.path}/${inlineInputValue.trim()}`
            : inlineInputValue.trim();

        if (inlineInput.type === 'file') {
            createFile(projectName, fullPath);
        } else if (inlineInput.type === 'folder') {
            createFolder(projectName, fullPath);
        } else if (inlineInput.type === 'rename') {
            rename(projectName, inlineInput.path, inlineInputValue.trim());
        }

        await loadContents(inlineInput.path);
        setInlineInput(null);
        setInlineInputValue('');
        }, [inlineInput, inlineInputValue, projectName, loadContents]);

        const cancelInlineInput = useCallback(() => {
        setInlineInput(null);
        setInlineInputValue('');
        }, []);

    const styles = useMemo(() => ({
        container: {
            backgroundColor: theme.surface,
            borderRightWidth: 1,
            borderRightColor: theme.border,
            overflow: 'hidden' as const,
        },
        header: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        projectName: {
            color: theme.textSecondary,
            fontSize: 11,
            fontWeight: '600' as const,
            textTransform: 'uppercase' as const,
            letterSpacing: 1,
        },
        headerButtons: {
            flexDirection: 'row' as const,
            gap: 4,
        },
        iconButton: {
            padding: 4,
            borderRadius: 4,
        },
        treeItem: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            paddingVertical: 2,
            paddingRight: 8,
        },
        treeItemText: {
            color: theme.text,
            fontSize: 13,
            marginLeft: 4,
        },
        selectedItem: {
            backgroundColor: theme.accent + '33',
        },
        collapsedBar: {
            width: 40,
            alignItems: 'center' as const,
            paddingTop: 8,
        },
        }), [theme]);



    const renderTree = useCallback((folderPath: string, depth: number)=>{
        console.log('[FileTree] renderTree called with folderPath:', folderPath, 'depth:', depth);
        console.log('[FileTree] inlineInput at render time:', inlineInput);
        console.log('[FileTree] contents at folderPath:', contents[folderPath]);


        const items: React.ReactNode[] = [];

        const folderContents = contents[folderPath];


        if (!folderContents) {
            console.log('[FileTree] Returning items count:', items.length);
            return items;
        }

        for (const folder of folderContents.folders) {
            const fullPath = folderPath ? `${folderPath}/${folder}` : folder;
            const isExpanded = expandedFolders.has(fullPath);   


            items.push(
            <TreeItem
                key={fullPath}
                name={folder}
                path={fullPath}
                isFolder={true}
                depth={depth}
                isExpanded={isExpanded}
                isSelected={false}
                theme={theme}
                onPress={() => toggleFolder(fullPath)}
                onLongPress={() => console.log('long press folder', fullPath)}
            />
            );


            if (isExpanded) {
                items.push(...(renderTree(fullPath, depth + 1) ?? []));
            }

        }

        

        for (const file of folderContents.files) {
            const fullPath = folderPath ? `${folderPath}/${file}` : file;

            items.push(
            <TreeItem
                key={fullPath}
                name={file}
                path={fullPath}
                isFolder={false}
                depth={depth}
                isExpanded={false}
                isSelected={selectedFile === fullPath}
                theme={theme}
                onPress={() => {
                setSelectedFile(fullPath);
                onFileOpen(fullPath);
                }}
                onLongPress={() => console.log('long press file', fullPath)}
            />
            );
        }

        console.log('[FileTree] Returning items count:', items.length);
        return items;


    }, [contents, expandedFolders, selectedFile, theme, toggleFolder, onFileOpen]);

    return (
  <Animated.View style={[styles.container, { width: sideBarWidth }]}>
    {collapsed ? (
      <View style={styles.collapsedBar}>
        <TouchableOpacity onPress={toggleCollapse} accessibilityLabel="Expand sidebar">
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <View style={styles.header}>
          <Text style={styles.projectName}>{projectName}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                console.log('[FileTree] New file button pressed');
                console.log('[FileTree] Setting inlineInput to:', { path: '', type: 'file' });
                setInlineInput({ path: '', type: 'file' });
                console.log('[FileTree] inlineInput state set');
              }}
              accessibilityLabel="New file"
            >
              <Ionicons name="document-outline" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                console.log('[FileTree] New folder button pressed');
                console.log('[FileTree] Setting inlineInput to:', { path: '', type: 'folder' });
                setInlineInput({ path: '', type: 'folder' });
                console.log('[FileTree] inlineInput state set');
              }}
              accessibilityLabel="New folder"
            >
              <Ionicons name="folder-outline" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleCollapse}
              accessibilityLabel="Collapse sidebar"
            >
              <Ionicons name="chevron-back" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
        {inlineInput && inlineInput.path === '' && (
            <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 3,
                paddingLeft: 8,
                paddingRight: 8,
            }}
            >
            {(console.log('[FileTree] Direct JSX inline input rendered for path:', inlineInput?.path), null)}
            <Ionicons
                name={inlineInput.type === 'folder' ? 'folder-outline' : 'document-outline'}
                size={14}
                color={theme.textSecondary}
            />
            <TextInput
                ref={inputRef}
                value={inlineInputValue}
                onChangeText={setInlineInputValue}
                onSubmitEditing={confirmInlineInput}
                onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Escape') cancelInlineInput();
                }}
                placeholder="File name..."
                placeholderTextColor={theme.textSecondary}
                style={{
                color: theme.text,
                fontSize: 13,
                marginLeft: 4,
                flex: 1,
                backgroundColor: theme.inputBg,
                borderWidth: 1,
                borderColor: theme.accent,
                borderRadius: 2,
                paddingHorizontal: 4,
                paddingVertical: 1,
                }}
                accessibilityLabel="Enter name"
            />
            </View>
        )}
        {renderTree('', 0)}
        </ScrollView>
      </>
    )}
  </Animated.View>
);
}