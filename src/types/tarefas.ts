export interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
}

export type NovaTarefa = Pick<Tarefa, 'titulo'>;

export type AtualizarTarefa = Partial<Omit<Tarefa, 'id'>>;

export type SubstituirTarefa = Omit<Tarefa, 'id'>;

export interface RespostaPaginada<T> {
    dados: T[];
    meta: {
    pagina: number;
    limite: number;
    total: number;
    };
}