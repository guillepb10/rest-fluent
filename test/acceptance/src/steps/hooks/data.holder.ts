import {After} from 'cucumber';
import { dataHolder } from '../domain/data.holder';

After(() => {
    dataHolder.clear();
});