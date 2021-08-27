import * as fs from 'fs';
import * as path from 'path';
export class TrieNode {

    value: string;
    eow: boolean;
    children: any;
    filePaths: string[];

    constructor(value: string) {
        this.value = value;
        this.eow = false;
        this.filePaths = [];
        this.children = {};
    }
}

class CreateTries {

    root: TrieNode =  new TrieNode('.');
    

    traverseDirs(directory: string) {
        fs.readdirSync(directory).forEach(File => {
            const absolute = path.join(directory, File);
            if (fs.statSync(absolute).isDirectory()) 
                return this.traverseDirs(absolute);
            else {
                this.indexEmails(absolute);
            } 
        });
    }

    indexEmails(filePath: string) {
        const file = fs.readFileSync(filePath, 'utf-8');
        file.split(' ').forEach(word => this.insert(word, filePath));
        return this.root;
    }

    insert(word: string, filePath: string) {
        
        let currentNode = this.root;
        let characters = [...word].map(character => character.toLowerCase());

        characters.forEach((character: string) => {
            if(currentNode.children[character] == undefined) {
                currentNode.children[character] = new TrieNode(character);
            }
            currentNode = currentNode.children[character];
            

        });
        currentNode.eow = true;
        currentNode.filePaths.push(filePath);
    }


    search(trieRoot: TrieNode, searchTerm: string) {
        let currentNode = trieRoot;
        if(!searchTerm) return [];
        else {
            
            let characters = [...searchTerm].map(character => character.toLowerCase());

            characters.forEach((character: string) => {
                if(currentNode.children[character] !== undefined) {
                    currentNode = currentNode.children[character];
                }
            });

        return currentNode.filePaths;

        }
    }
}

const createTries = new CreateTries();

const rootDirectory = '/home/vivek/Pioneer/skilling-j';

const trieStructure = createTries.traverseDirs(rootDirectory);


console.log(trieStructure);


