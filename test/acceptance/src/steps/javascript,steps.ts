import {Given} from 'cucumber';
import { dataHolder } from './domain/data.holder'

Given('a referece from file {string} with name {string} saved into {string}', (file: string, name: string, key: string) => {
    dataHolder.put(key, require(file)[name]);
});