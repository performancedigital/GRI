'use client';

export default function HomePage() {
  return (
    <div className="px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5 mb-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Jogos Disponíveis para Palpite
          </h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Preencha seus palpites antes do início de cada partida. Acertar o placar exato vale 3 pontos. Acertar apenas a seleção vencedora (ou empate) vale 2 pontos.
          </p>
        </div>
        
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum jogo carregado ainda.</p>
        </div>
      </div>
    </div>
  );
}
