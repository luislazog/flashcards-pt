import { BASE_CARDS } from './cards';
import { Card } from './types';

export type Pack = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  premium: boolean;
  cards: Card[];
};

const c = (id: string, pt: string, es: string, example?: string): Card => ({ id, pt, es, example });

const FALSOS_AMIGOS: Card[] = [
  c('fa-esquisito', 'Esquisito', 'Raro, extraño (no es "exquisito")', 'Que comida esquisita!'),
  c('fa-embaracada', 'Embaraçada', 'Avergonzada (no es "embarazada")', 'Fiquei embaraçada com a pergunta.'),
  c('fa-gravida', 'Grávida', 'Embarazada', 'Minha irmã está grávida.'),
  c('fa-pegar', 'Pegar', 'Agarrar, tomar (un bus)', 'Vou pegar o ônibus.'),
  c('fa-apelido', 'Apelido', 'Apodo (no es "apellido")', 'Meu apelido é Zé.'),
  c('fa-sobrenome', 'Sobrenome', 'Apellido', 'Qual é o seu sobrenome?'),
  c('fa-oficina', 'Oficina', 'Taller (no es "oficina")', 'Levei o carro à oficina.'),
  c('fa-escritorio', 'Escritório', 'Oficina', 'Trabalho num escritório no centro.'),
  c('fa-jantar', 'Jantar', 'Cenar / la cena', 'Vamos jantar às oito.'),
  c('fa-copo', 'Copo', 'Vaso (para beber)', 'Me dá um copo de água?'),
  c('fa-xicara', 'Xícara', 'Taza', 'Uma xícara de café.'),
  c('fa-largo', 'Largo', 'Ancho (no es "largo")', 'A rua é larga.'),
  c('fa-comprido', 'Comprido', 'Largo (de longitud)', 'O rio é muito comprido.'),
  c('fa-cachorro', 'Cachorro', 'Perro', 'O cachorro é muito fofo.'),
  c('fa-presunto', 'Presunto', 'Jamón (no es "presunto")', 'Sanduíche de presunto e queijo.'),
  c('fa-polvo', 'Polvo', 'Pulpo (no es "polvo")', 'Arroz com polvo.'),
  c('fa-poeira', 'Poeira', 'Polvo (partículas)', 'Tem muita poeira aqui.'),
  c('fa-gorjeta', 'Gorjeta', 'Propina', 'Deixei uma gorjeta de dez por cento.'),
  c('fa-tirar', 'Tirar', 'Sacar, quitar (no solo "tirar")', 'Vou tirar uma foto.'),
  c('fa-esperto', 'Esperto', 'Listo, astuto (no es "espero")', 'Ele é muito esperto.'),
  c('fa-brincar', 'Brincar', 'Jugar (los niños), bromear', 'As crianças gostam de brincar.'),
  c('fa-bebado', 'Bêbado', 'Borracho', 'Ele está bêbado.'),
  c('fa-borracha', 'Borracha', 'Goma de borrar (o caucho)', 'Preciso de uma borracha.'),
  c('fa-azeite', 'Azeite', 'Aceite de oliva', 'Salada com azeite.'),
  c('fa-loiro', 'Loiro', 'Rubio', 'Ela tem cabelo loiro.'),
];

const VIAJES: Card[] = [
  c('vi-aeroporto', 'Aeroporto', 'Aeropuerto', 'O aeroporto fica longe do centro.'),
  c('vi-passaporte', 'Passaporte', 'Pasaporte', 'Esqueci meu passaporte.'),
  c('vi-bagagem', 'Bagagem', 'Equipaje', 'Onde fica a esteira de bagagem?'),
  c('vi-mala', 'Mala', 'Maleta, valija', 'Fiz a mala ontem à noite.'),
  c('vi-pousada', 'Pousada', 'Posada, alojamiento pequeño', 'Ficamos numa pousada na praia.'),
  c('vi-reserva', 'Reserva', 'Reserva', 'Tenho uma reserva em nome de Luis.'),
  c('vi-quarto', 'Quarto', 'Habitación, cuarto', 'Um quarto com duas camas.'),
  c('vi-chave', 'Chave', 'Llave', 'Perdi a chave do quarto.'),
  c('vi-praia', 'Praia', 'Playa', 'A praia está lotada hoje.'),
  c('vi-esquerda', 'Esquerda', 'Izquierda', 'Vire à esquerda.'),
  c('vi-direita', 'Direita', 'Derecha', 'Vire à direita no semáforo.'),
  c('vi-emfrente', 'Siga em frente', 'Siga recto, todo derecho', 'Siga em frente por duas quadras.'),
  c('vi-quadra', 'Quadra', 'Cuadra', 'O hotel fica a duas quadras daqui.'),
  c('vi-rodoviaria', 'Rodoviária', 'Terminal de buses', 'A rodoviária fica perto.'),
  c('vi-metro', 'Metrô', 'Metro', 'Pegamos o metrô até o centro.'),
  c('vi-trem', 'Trem', 'Tren', 'O trem sai às nove.'),
  c('vi-cambio', 'Câmbio', 'Cambio de moneda', 'Onde posso fazer o câmbio?'),
  c('vi-troco', 'Troco', 'Vuelto (el cambio)', 'Pode ficar com o troco.'),
  c('vi-cartao', 'Cartão', 'Tarjeta', 'Aceita cartão de crédito?'),
  c('vi-ingresso', 'Ingresso', 'Entrada (boleto de espectáculo)', 'Dois ingressos para o museu.'),
  c('vi-fila', 'Fila', 'Fila, cola', 'A fila está enorme.'),
  c('vi-atrasado', 'Atrasado', 'Retrasado, con retraso', 'O voo está atrasado.'),
  c('vi-cedo', 'Cedo', 'Temprano', 'Chegamos cedo ao aeroporto.'),
  c('vi-perdido', 'Estou perdido', 'Estoy perdido', 'Desculpe, estou perdido. Onde fica a praça?'),
  c('vi-socorro', 'Socorro!', '¡Auxilio!', 'Socorro! Chamem a polícia!'),
  c('vi-farmacia', 'Farmácia', 'Farmacia', 'Tem uma farmácia por aqui?'),
];

const RESTAURANTE: Card[] = [
  c('re-cardapio', 'Cardápio', 'Menú, carta', 'Pode trazer o cardápio, por favor?'),
  c('re-conta', 'A conta, por favor', 'La cuenta, por favor', 'A conta, por favor!'),
  c('re-garcom', 'Garçom', 'Mesero, camarero', 'O garçom é muito simpático.'),
  c('re-mesa', 'Mesa para dois', 'Mesa para dos', 'Uma mesa para dois, por favor.'),
  c('re-prato', 'Prato', 'Plato', 'O prato do dia é feijoada.'),
  c('re-sobremesa', 'Sobremesa', 'Postre', 'Qual é a sobremesa de hoje?'),
  c('re-suco', 'Suco', 'Jugo', 'Um suco de laranja, por favor.'),
  c('re-refri', 'Refrigerante', 'Gaseosa, refresco', 'Um refrigerante gelado.'),
  c('re-chope', 'Chope', 'Cerveza de barril', 'Dois chopes, por favor.'),
  c('re-carne', 'Carne', 'Carne', 'Eu quero a carne bem passada.'),
  c('re-peixe', 'Peixe', 'Pescado, pez', 'O peixe está fresquinho.'),
  c('re-camarao', 'Camarão', 'Camarón', 'Moqueca de camarão.'),
  c('re-batata', 'Batata', 'Papa, patata', 'Batata frita, por favor.'),
  c('re-queijo', 'Queijo', 'Queso', 'Pão de queijo é delicioso.'),
  c('re-ovo', 'Ovo', 'Huevo', 'Dois ovos mexidos.'),
  c('re-sal', 'Sal', 'Sal', 'Falta sal na sopa.'),
  c('re-pimenta', 'Pimenta', 'Pimienta, ají', 'Você gosta de pimenta?'),
  c('re-acucar', 'Açúcar', 'Azúcar', 'Café sem açúcar.'),
  c('re-faca', 'Faca', 'Cuchillo', 'Pode trazer uma faca?'),
  c('re-garfo', 'Garfo', 'Tenedor', 'Preciso de outro garfo.'),
  c('re-colher', 'Colher', 'Cuchara', 'Uma colher de sopa.'),
  c('re-guardanapo', 'Guardanapo', 'Servilleta', 'Pode trazer mais guardanapos?'),
  c('re-gelo', 'Gelo', 'Hielo', 'Sem gelo, por favor.'),
  c('re-fome', 'Estou com fome', 'Tengo hambre', 'Estou com muita fome!'),
  c('re-sede', 'Estou com sede', 'Tengo sed', 'Estou com sede, vou pedir água.'),
  c('re-delicioso', 'Delicioso', 'Delicioso, riquísimo', 'Tudo estava delicioso!'),
];

export const PACKS: Pack[] = [
  {
    id: 'basico',
    title: 'Básico',
    emoji: '🌱',
    description: 'Saludos, comida, números y verbos esenciales',
    premium: false,
    cards: BASE_CARDS,
  },
  {
    id: 'falsos-amigos',
    title: 'Falsos amigos',
    emoji: '🎭',
    description: 'Palabras que parecen español pero significan otra cosa',
    premium: true,
    cards: FALSOS_AMIGOS,
  },
  {
    id: 'viajes',
    title: 'Viajes',
    emoji: '✈️',
    description: 'Aeropuerto, hotel, transporte y direcciones',
    premium: true,
    cards: VIAJES,
  },
  {
    id: 'restaurante',
    title: 'Restaurante',
    emoji: '🍽️',
    description: 'Pedir, pagar y hablar de comida',
    premium: true,
    cards: RESTAURANTE,
  },
];

export const PRODUCT_ID = 'bora_pro';

export const availableCards = (custom: Card[], premium: boolean): Card[] => [
  ...PACKS.filter((p) => premium || !p.premium).flatMap((p) => p.cards),
  ...custom,
];
