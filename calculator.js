var app = new Vue({
  el: "#app",
  data: {
    payload_len: null,
    preamble_len: null,
    spreading_factor: 7,
    bandwidth: 125,
    coding_rate: 5,
    crc: false,
    explicit_header: false,
    low_data_rate_opt: false,
    payload_len_valid: true,
    preamble_len_valid: true,
  },
  methods: {
    check_payload_len: function () {
      this.payload_len_valid = !(
        this.payload_len < 1 || this.payload_len > 255
      );
    },
    check_preamble_len: function () {
      this.preamble_len_valid = !(
        this.preamble_len < 6 || this.preamble_len > 655365
      );
    },
  },
  computed: {
    symbol_time: function () {
      return (Math.pow(2, this.spreading_factor) / this.bandwidth).toFixed(3);
    },
    symbol_rate: function () {
      return (1000 / this.symbol_time).toFixed(3);
    },
    throughput: function () {
      if (this.t_total !== "-") {
        return (
          ((8 * this.payload_len) / parseFloat(this.t_total)) *
          1000
        ).toFixed(3);
      } else {
        return "-";
      }
    },
    n_preamble: function () {
      if (this.preamble_len !== null) {
        return this.preamble_len + 4.25;
      } else {
        return "-";
      }
    },
    t_preamble: function () {
      if (this.preamble_len !== null) {
        return (this.n_preamble * this.symbol_time).toFixed(3);
      } else {
        return "-";
      }
    },
    n_payload: function () {
      if (this.payload_len !== null) {
        let payload_bit = 8 * this.payload_len; // The lenght of payload in bits
        payload_bit -= 4 * this.spreading_factor; // ???
        payload_bit += 28; // Mistry magic number
        payload_bit += 16 * (0 + this.crc); // The length of CRC is 16 bits
        payload_bit += 20 * (0 + this.explicit_header); // The length of LoRa header is 20 bits
        let payload_coded = (payload_bit * this.coding_rate) / 4; // Perform forward error correction coding on original payload
        let payload_symbol = Math.ceil(
          payload_coded /
            (this.spreading_factor - 2 * (0 + this.low_data_rate_opt))
        ); // Mapping bits to symbol
        payload_symbol = Math.max(payload_symbol, 0); // Minimum possible symbol is 0
        payload_symbol += 8; // There's always a 8-symbol-long overhead. Probably is SyncWord.

        return payload_symbol;
      } else {
        return "-";
      }
    },
    t_payload: function () {
      if (this.payload_len !== null) {
        return (this.n_payload * this.symbol_time).toFixed(3);
      } else {
        return "-";
      }
    },
    t_total: function () {
      if (this.t_preamble !== "-" && this.t_payload !== "-") {
        return (
          parseFloat(this.t_preamble) + parseFloat(this.t_payload)
        ).toFixed(3);
      } else {
        return "-";
      }
    },
  },
});
