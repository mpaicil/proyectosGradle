package com.slackmag.dependency.domain;

import java.util.List;

public class Ticker {

    public String market_id;
    public List<String> last_price;
    public List<String> min_ask;
    public List<String> max_bid;
    public List<String> volume;
    public String price_variation_24h;
    public String price_variation_7d;

}
