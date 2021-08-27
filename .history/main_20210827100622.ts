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

        // console.log(JSON.stringify(this.root));

        fs.writeFileSync('/home/vivek/Pioneer/tries.txt', JSON.stringify(this.root));

        return '';
    }

    indexEmails(filePath: string) {
        const file = fs.readFileSync(filePath, 'utf-8');
        const words: string[] = file.split(' ');

        for(let word of words) {
            this.insert(word, filePath);
        }
    }

    isLetter(l: string) {
      return l.toLowerCase() != l.toUpperCase();
    }

    insert(word: string, filePath: string) {
        
        let currentNode = this.root;
        let characters = [...word].filter(l => this.isLetter(l)).map(character => character.toLowerCase());

        characters.forEach((character: string) => {
            if(currentNode.children[character] == undefined) {
                currentNode.children[character] = new TrieNode(character);
            }
            currentNode = currentNode.children[character];
            

        });
        currentNode.eow = true;
        currentNode.filePaths.push(filePath);
    }


    search(triePath: string, searchTerm: string) {

        const trieFile = fs.readFileSync(triePath, 'utf-8');
        const trieRoot = JSON.parse(trieFile); 
        let currentNode = trieRoot;
        if(!searchTerm) return [];
        else {
            
            let characters = [...searchTerm].filter(l => this.isLetter(l)).map(character => character.toLowerCase());

            characters.forEach((character: string) => {
                if(currentNode.children[character] !== undefined) {
                    currentNode = currentNode.children[character];
                }
            });

        return currentNode.filePaths;

        }
    }
}

console.time('watchTries');
const createTries = new CreateTries();

const rootDirectory = '/home/vivek/Pioneer/skilling-j';

const trieStructure = createTries.traverseDirs(rootDirectory);

// console.log(createTries.search(trieStructure, '<markskilling@hotmail.com>'));
console.timeEnd('watchTries')




