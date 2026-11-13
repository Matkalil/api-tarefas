export interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
}

export type NovaTarefa = Pick<Tarefa, 'titulo'>;

export type AtualizarTarefa = Partial<Omit<Tarefa, 'id'>>;
