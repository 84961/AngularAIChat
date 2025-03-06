import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AAChatService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;
  http = inject(HttpClient);

  private chatHistory = signal<{ role: string; content: string }[]>([
    { role: 'system', content: 
        'You are a helpful assistant for an Airline called FlightAI. ' +
        'Give short, courteous answers, no more than 1 sentence.' +
        'Always be accurate. If you don\'t know the answer, say so'
     }
  ]);

  constructor() {}

  sendMessage(message: string): Observable<any> {
    this.chatHistory.update(history => [...history, { role: 'user', content: message }]);


    // below is how we need to pass for github marketplace model
        //const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` };
        
        // below is how we need to pass for azure open ai
        const headers = new HttpHeaders({
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        });

    const body = {
      messages: this.chatHistory(),
      //model: 'gpt-4o-mini',  // for github marketplace  need to pass the model name
      tools: [
        {
          type: "function",
          function: {
            name: "get_ticket_price",
            description: "Fetch the flight ticket price to a destination city",
            parameters: {
              type: "object",
              properties: {
                destination_city: { type: "string", description: "The destination city" }
              },
              required: ["destination_city"]
            }
          }
        }
      ],
      tool_choice: "auto"
    };

    return new Observable(observer => {
      this.http.post<any>(this.apiUrl, body, { headers }).subscribe(response => {
        const firstChoice = response?.choices?.[0];

        if (firstChoice?.finish_reason === "tool_calls") {
          // Model is requesting a function call
          const toolCall = firstChoice.message.tool_calls?.[0];
          if (toolCall) {
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments || '{}');

            if (functionName === 'get_ticket_price') {
              const city = args.destination_city;
              const price = this.getTicketPrice(city);

              // Append the tool response (IMPORTANT: Must use role "tool" and include tool_call_id)
              this.chatHistory.update(history => [
                ...history,
                firstChoice.message, // Preserve the original tool call request
                {
                  role: "tool", // Correct role for function response
                  content: JSON.stringify({ destination_city: city, price: price }),
                  tool_call_id: toolCall.id // Ensure correct tool_call_id
                }
              ]);

              // Resend updated messages to get final response
              this.sendUpdatedMessages(observer);
            }
          }
        } else {
          this.handleResponse(response, observer);
        }
      }, error => observer.error(error));
    });
  }

  private sendUpdatedMessages(observer: any) {
     // below is how we need to pass for github marketplace model
        //const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` };
        
        // below is how we need to pass for azure open ai
        const headers = new HttpHeaders({
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        });

    const body = {
      messages: this.chatHistory(),
      //model: 'gpt-4o-mini' // required only for github model not for azure open ai
    };

    this.http.post<any>(this.apiUrl, body, { headers }).subscribe(finalResponse => {
      this.handleResponse(finalResponse, observer);
    }, error => observer.error(error));
  }

  private handleResponse(response: any, observer: any) {
    const botReply = response?.choices?.[0]?.message?.content || 'Error: No response';
    this.chatHistory.update(history => [...history, { role: 'assistant', content: botReply }]);
    observer.next(botReply);
    observer.complete();
  }

  getChatHistory() {
    return this.chatHistory.asReadonly();
  }

  private getTicketPrice(destinationCity: string): string {
    console.log(`Tool get_ticket_price called for ${destinationCity}`);
    const ticketPrices: Record<string, string> = {
      london: "$799",
      paris: "$899",
      tokyo: "$1400",
      berlin: "$499"
    };
    return ticketPrices[destinationCity.toLowerCase()] || "Unknown";
  }
}
