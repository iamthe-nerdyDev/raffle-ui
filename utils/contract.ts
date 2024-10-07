import {
  RaffleContractClient,
  RaffleContractQueryClient,
} from "@/types/RaffleContract.client";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  toBinary,
} from "@cosmjs/cosmwasm-stargate";
import { getClient } from ".";
import env from "./env";

class RaffleContract {
  private senderAddr: string | null;
  private queryClient: RaffleContractQueryClient | null;
  private signingClient: RaffleContractClient | null;

  constructor(senderAddr: string | null) {
    this.senderAddr = senderAddr;
    this.queryClient = null;
    this.signingClient = null;
  }

  async initQueryClient(client?: CosmWasmClient) {
    if (!env.CONTRACT_ADDRESS) throw new Error("Contract address not set");

    this.queryClient = new RaffleContractQueryClient(
      client || (await getClient()),
      env.CONTRACT_ADDRESS
    );
  }

  async initSigningClient(client: SigningCosmWasmClient) {
    if (!env.CONTRACT_ADDRESS) throw new Error("Contract address not set");
    if (!this.senderAddr) throw new Error("Sender address not found");

    this.signingClient = new RaffleContractClient(
      client,
      this.senderAddr,
      env.CONTRACT_ADDRESS
    );
  }

  async getConfig() {
    if (!this.queryClient) await this.initQueryClient();
    return this.queryClient?.config().catch(() => undefined);
  }

  async getRaffle(raffleId: number) {
    if (!this.queryClient) await this.initQueryClient();
    return this.queryClient?.getRaffle({ raffleId }).catch(() => undefined);
  }

  async getRaffles(limit = 6, startAfter?: string) {
    if (!this.queryClient) await this.initQueryClient();

    return this.queryClient
      ?.getAllRaffles({ limit, startAfter })
      .catch(() => undefined);
  }

  async getOngoingRaffles(limit = 6, startAfter?: string) {
    if (!this.queryClient) await this.initQueryClient();

    return this.queryClient
      ?.getOngoingRaffles({ limit, startAfter })
      .catch(() => undefined);
  }

  async getEndedRaffles(limit = 6, startAfter?: string) {
    if (!this.queryClient) await this.initQueryClient();

    return this.queryClient
      ?.getEndedRaffles({ limit, startAfter })
      .catch(() => undefined);
  }

  async getRafflesWonByUser(user: string, limit = 6, startAfter?: string) {
    if (!this.queryClient) await this.initQueryClient();

    return this.queryClient
      ?.getRafflesByWinner({ user, limit, startAfter })
      .catch(() => undefined);
  }

  async getUserRaffles(user: string, limit = 6, startAfter?: string) {
    if (!this.queryClient) await this.initQueryClient();

    return this.queryClient
      ?.getRafflesByOwner({ user, limit, startAfter })
      .catch(() => undefined);
  }

  async getUserTicketCount(raffleId: number, user: string) {
    if (!this.queryClient) await this.initQueryClient();
    return this.queryClient
      ?.getUserTicketCount({ raffleId, user })
      .catch(() => undefined);
  }

  async getRaffleTickets(raffleId: number) {
    if (!this.queryClient) await this.initQueryClient();
    return this.queryClient
      ?.getRaffleTickets({ raffleId })
      .catch(() => undefined);
  }

  async createRaffle(
    client: SigningCosmWasmClient,
    nft_ca: string,
    token_id: string,
    sender: string,
    data: {
      max_ticket_per_user: number | null;
      raffle_end_time: number | null;
      total_tickets_available_for_sale: number | null;
    }
  ) {
    const msg = toBinary(data);
    return await client.execute(
      sender,
      nft_ca,
      { send_nft: { contract: env.CONTRACT_ADDRESS, token_id, msg } },
      "auto"
    );
  }

  async buyTicket(
    client: SigningCosmWasmClient,
    raffleId: number,
    amount: string
  ) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.buyTicket({ raffleId }, "auto", undefined, [
      { denom: "orai", amount },
    ]);
  }

  async endRaffle(client: SigningCosmWasmClient, raffleId: number) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.endRaffle({ raffleId }, "auto");
  }

  async updateWlAddresses(client: SigningCosmWasmClient, addresses: string[]) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.updateWhitelistedAddresses(
      { addresses },
      "auto"
    );
  }

  async updateAdminAddresses(
    client: SigningCosmWasmClient,
    addresses: string[]
  ) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.updateWhitelistedAddresses(
      { addresses },
      "auto"
    );
  }

  async updateTicketPrice(client: SigningCosmWasmClient, price: number) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.updateTicketPrice({ price }, "auto");
  }

  async updateProtocolAddress(client: SigningCosmWasmClient, address: string) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.updateProtocolAddress({ address }, "auto");
  }

  async updateProtocolPercent(
    client: SigningCosmWasmClient,
    percentage: number
  ) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.updateProtocolPercentagee(
      { percentage },
      "auto"
    );
  }

  async enableWhitelist(client: SigningCosmWasmClient) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.enableWhitelist("auto");
  }

  async disableWhitelist(client: SigningCosmWasmClient) {
    if (!this.signingClient) await this.initSigningClient(client);
    return this.signingClient?.disableWhitelist("auto");
  }
}

export default RaffleContract;
